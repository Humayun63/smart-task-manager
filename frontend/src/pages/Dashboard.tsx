import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, message, Button } from 'antd';
import {
    ProjectOutlined,
    CheckSquareOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { dashboardService, taskService, activityLogService } from '../services';
import type { DashboardData } from '../types';
import {
    SummaryCard,
    TeamLoadCard,
    RecentReassignments,
    TaskReassignModal,
} from '../components/dashboard';

const { Title } = Typography;

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);
    const [reassigning, setReassigning] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboard();
            setData(response.data);
        } catch (error: any) {
            message.error('Failed to load dashboard data');
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAutoReassign = async () => {
        try {
            setReassigning(true);

            // Check if there are any overloaded members
            const overloadedMembers = data?.teamSummary?.filter((m) => m.overloaded) || [];
            
            if (overloadedMembers.length === 0) {
                message.info('No overloaded team members found');
                return;
            }

            // Get all unique team IDs from overloaded members
            // Since teamSummary doesn't have teamId, we'll trigger auto-reassign for all teams
            const { teamService } = await import('../services');
            const teamsResponse = await teamService.getTeams();
            const teams = teamsResponse.data.teams;

            let totalReassigned = 0;
            const allReassignments: any[] = [];

            // Auto-reassign for each team
            for (const team of teams) {
                try {
                    const result = await taskService.autoReassignTasks(team.id);
                    totalReassigned += result.data.reassignedCount;
                    allReassignments.push(...result.data.reassignments);

                    // Log activity
                    if (result.data.reassignedCount > 0) {
                        await activityLogService.createActivityLog({
                            team: team.id,
                            message: `Auto-reassigned ${result.data.reassignedCount} task(s) to balance team workload`,
                        });
                    }
                } catch (error) {
                    console.error(`Failed to auto-reassign for team ${team.id}:`, error);
                }
            }

            if (totalReassigned > 0) {
                message.success(`Successfully reassigned ${totalReassigned} task(s)`);
                // Refresh dashboard data
                await fetchDashboardData();
            } else {
                message.info('No tasks needed reassignment');
            }
        } catch (error: any) {
            message.error('Failed to auto-reassign tasks');
            console.error('Auto-reassignment error:', error);
        } finally {
            setReassigning(false);
        }
    };

    const handleReassignClick = (memberId: string, memberName: string) => {
        setSelectedMember({ id: memberId, name: memberName });
        setModalVisible(true);
    };

    const handleReassignConfirm = async (toMemberId: string) => {
        if (!selectedMember) return;

        try {
            // Import services
            const { taskService, activityService, teamService } = await import('../services');

            // Get all teams to find which team this member belongs to
            const teamsResponse = await teamService.getTeams();
            const teams = teamsResponse.data.teams;

            // Find the team containing both members
            const team = teams.find((t) =>
                t.members.some((m) => m.id === selectedMember.id) &&
                t.members.some((m) => m.id === toMemberId)
            );

            if (!team) {
                message.error('Could not find team for these members');
                return;
            }

            // Reassign all tasks from the overloaded member to the selected member
            const result = await taskService.reassignTasks(
                selectedMember.id,
                toMemberId,
                team.id
            );

            // Create activity log
            const fromMemberName = selectedMember.name;
            const toMember = team.members.find((m) => m.id === toMemberId);
            const toMemberName = toMember?.name || 'Unknown';

            await activityService.createLog({
                teamId: team.id,
                message: `${result.reassignedCount} task(s) reassigned from ${fromMemberName} to ${toMemberName}`,
            });

            message.success(`Successfully reassigned ${result.reassignedCount} task(s)`);

            // Refresh dashboard data
            await fetchDashboardData();
        } catch (error: any) {
            message.error('Failed to reassign tasks');
            console.error('Reassignment error:', error);
        }
    };

    const totalProjects = data?.totalProjects ?? 0;
    const totalTasks = data?.totalTasks ?? 0;
    const activeTeams = data?.teamSummary?.length ?? 0;
    const pendingTasks = data?.teamSummary?.reduce((sum, member) => sum + member.currentTasks, 0) ?? 0;

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
                        Dashboard
                    </Title>
                    <p className="text-text-muted text-sm md:text-base">Welcome back! Here's an overview of your workspace.</p>
                </div>
                
                {/* Reassign Tasks Button */}
                {data?.teamSummary && data.teamSummary.some((m) => m.overloaded) && (
                    <Button
                        type="primary"
                        size="large"
                        icon={<SwapOutlined />}
                        loading={reassigning}
                        onClick={handleAutoReassign}
                        className="self-start md:self-auto"
                    >
                        Reassign Tasks
                    </Button>
                )}
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <SummaryCard
                        title="Total Projects"
                        value={totalProjects}
                        icon={<ProjectOutlined className="text-primary" />}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <SummaryCard
                        title="Total Tasks"
                        value={totalTasks}
                        icon={<CheckSquareOutlined className="text-primary" />}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <SummaryCard
                        title="Active Teams"
                        value={activeTeams}
                        icon={<TeamOutlined className="text-primary" />}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <SummaryCard
                        title="Pending Tasks"
                        value={pendingTasks}
                        icon={<ClockCircleOutlined className="text-primary" />}
                        loading={loading}
                    />
                </Col>
            </Row>

            <div>
                <TeamLoadCard
                    teamMembers={data?.teamSummary ?? []}
                    loading={loading}
                    onReassign={handleReassignClick}
                />
            </div>

            <div>
                <RecentReassignments
                    reassignments={data?.recentReassignments ?? []}
                    loading={loading}
                />
            </div>

            <TaskReassignModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                fromMember={selectedMember}
                teamMembers={data?.teamSummary ?? []}
                onConfirm={handleReassignConfirm}
            />
        </div>
    );
};
