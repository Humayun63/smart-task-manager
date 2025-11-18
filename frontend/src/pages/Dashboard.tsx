import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, message } from 'antd';
import {
    ProjectOutlined,
    CheckSquareOutlined,
    TeamOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { dashboardService } from '../services';
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

    const handleReassignClick = (memberId: string, memberName: string) => {
        setSelectedMember({ id: memberId, name: memberName });
        setModalVisible(true);
    };

    const handleReassignConfirm = async (toMemberId: string) => {
        // TODO: Implement actual reassignment API call
        console.log('Reassigning from', selectedMember?.id, 'to', toMemberId);

        // Simulated API call - replace with actual service call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Refresh dashboard data after reassignment
        await fetchDashboardData();
    };

    const totalProjects = data?.totalProjects ?? 0;
    const totalTasks = data?.totalTasks ?? 0;
    const activeTeams = data?.teamSummary?.length ?? 0;
    const pendingTasks = data?.teamSummary?.reduce((sum, member) => sum + member.currentTasks, 0) ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <Title level={2} className="!mb-2">
                    Dashboard
                </Title>
                <p className="text-text-muted">Welcome back! Here's an overview of your workspace.</p>
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
