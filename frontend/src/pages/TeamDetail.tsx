import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Typography,
    Table,
    message,
    Spin,
    Tag,
    Progress,
    Dropdown,
    Modal,
} from 'antd';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    MoreOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { teamService, taskService } from '../services';
import type { Team } from '../types';
import { AddMemberModal, EditMemberModal } from '../components/teams';

const { Title } = Typography;

export const TeamDetail: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [memberWorkload, setMemberWorkload] = useState<Record<string, number>>({});
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
    const [editMemberModalVisible, setEditMemberModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Team['members'][0] | null>(null);
    const [deleteMemberModalVisible, setDeleteMemberModalVisible] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Team['members'][0] | null>(null);
    const [deleteMemberLoading, setDeleteMemberLoading] = useState(false);

    const fetchTeamDetails = async () => {
        if (!teamId) return;

        try {
            setLoading(true);
            const response = await teamService.getTeam(teamId);
            setTeam(response.data.team);

            // Fetch task count for each member
            const tasksResponse = await taskService.getTasks();
            const tasks = tasksResponse.data.tasks;

            const workload: Record<string, number> = {};
            response.data.team.members.forEach((member) => {
                const memberTasks = tasks.filter((task) => task.assignedMember === member._id);
                workload[member._id] = memberTasks.length;
            });

            setMemberWorkload(workload);
        } catch (error: any) {
            message.error('Failed to load team details');
            console.error('Team detail fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamDetails();
    }, [teamId]);

    const handleDeleteMemberClick = (member: Team['members'][0]) => {
        setMemberToDelete(member);
        setDeleteMemberModalVisible(true);
    };

    const handleDeleteMemberConfirm = async () => {
        if (!teamId || !memberToDelete) return;

        try {
            setDeleteMemberLoading(true);
            await teamService.deleteMember(teamId, memberToDelete._id);
            message.success('Member removed successfully');
            setDeleteMemberModalVisible(false);
            setMemberToDelete(null);
            fetchTeamDetails();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Failed to remove member';
            message.error(errorMsg);
        } finally {
            setDeleteMemberLoading(false);
        }
    };

    const handleEditMember = (member: Team['members'][0]) => {
        setSelectedMember(member);
        setEditMemberModalVisible(true);
    };

    const columns: ColumnsType<Team['members'][0]> = [
        {
            title: 'Member',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record) => (
                <div>
                    <div className="flex items-center">
                        <UserOutlined className="mr-2 text-primary" />
                        <span className="font-medium">{name}</span>
                    </div>
                    <div className="text-sm text-text-muted mt-1">{record.role}</div>
                </div>
            ),
        },
        {
            title: 'Workload',
            key: 'workload',
            width: 200,
            responsive: ['md'] as any,
            render: (_: any, record) => {
                const currentTasks = memberWorkload[record._id] || 0;
                const percentage = Math.min((currentTasks / record.capacity) * 100, 100);
                const isOverloaded = currentTasks > record.capacity;

                return (
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className={isOverloaded ? 'text-red-500 font-semibold' : ''}>
                                {currentTasks} / {record.capacity} tasks
                            </span>
                            <span>{Math.round(percentage)}%</span>
                        </div>
                        <Progress
                            percent={Math.round(percentage)}
                            status={isOverloaded ? 'exception' : percentage > 80 ? 'normal' : 'active'}
                            showInfo={false}
                            size="small"
                        />
                    </div>
                );
            },
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            align: 'center',
            responsive: ['sm'] as any,
            render: (_: any, record) => {
                const currentTasks = memberWorkload[record._id] || 0;
                const isOverloaded = currentTasks > record.capacity;
                const percentage = (currentTasks / record.capacity) * 100;

                if (isOverloaded) {
                    return <Tag color="error">Overloaded</Tag>;
                } else if (percentage > 80) {
                    return <Tag color="warning">High Load</Tag>;
                }
                return <Tag color="success">Normal</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 100,
            fixed: 'right' as const,
            render: (_: any, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'edit',
                                label: 'Edit Member',
                                icon: <EditOutlined />,
                                onClick: () => handleEditMember(record),
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'delete',
                                label: 'Remove Member',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDeleteMemberClick(record),
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="text-center py-12">
                <p className="text-text-muted">Team not found</p>
                <Button type="link" onClick={() => navigate('/teams')}>
                    Back to Teams
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/teams')}
                    className="!p-0 mb-4"
                >
                    Back to Teams
                </Button>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
                            {team.name}
                        </Title>
                        <p className="text-text-muted text-sm md:text-base">
                            {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => setAddMemberModalVisible(true)}
                        className="w-full sm:w-auto"
                    >
                        Add Member
                    </Button>
                </div>
            </div>

            <Card title="Team Members">
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={team.members}
                        rowKey="_id"
                        scroll={{ x: 768 }}
                        pagination={{
                            pageSize: 10,
                            hideOnSinglePage: true,
                            responsive: true,
                        }}
                    />
                </div>
            </Card>

            {teamId && (
                <>
                    <AddMemberModal
                        visible={addMemberModalVisible}
                        onClose={() => setAddMemberModalVisible(false)}
                        onSuccess={fetchTeamDetails}
                        teamId={teamId}
                    />

                    <EditMemberModal
                        visible={editMemberModalVisible}
                        onClose={() => {
                            setEditMemberModalVisible(false);
                            setSelectedMember(null);
                        }}
                        onSuccess={fetchTeamDetails}
                        teamId={teamId}
                        member={selectedMember}
                    />

                    <Modal
                        title={
                            <div className="flex items-center gap-2">
                                <ExclamationCircleOutlined className="text-red-500" />
                                <span>Remove Member</span>
                            </div>
                        }
                        open={deleteMemberModalVisible}
                        onOk={handleDeleteMemberConfirm}
                        onCancel={() => {
                            setDeleteMemberModalVisible(false);
                            setMemberToDelete(null);
                        }}
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, loading: deleteMemberLoading }}
                        cancelButtonProps={{ disabled: deleteMemberLoading }}
                        confirmLoading={deleteMemberLoading}
                        centered
                    >
                        <p className="text-text-primary my-4">
                            Are you sure you want to remove <strong>{memberToDelete?.name}</strong> from the team?
                        </p>
                        <p className="text-text-muted text-sm">
                            This member will be removed from the team, but their assigned tasks will remain.
                        </p>
                    </Modal>
                </>
            )}
        </div>
    );
};
