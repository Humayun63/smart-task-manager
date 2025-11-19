import React, { useState, useEffect } from 'react';
import { Button, Table, Typography, message, Tag, Dropdown, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined, MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { teamService, activityLogService } from '../services';
import type { Team } from '../types';
import { CreateTeamModal, EditTeamModal } from '../components/teams';
import { formatDistanceToNow } from 'date-fns';

const { Title } = Typography;

export const Teams: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
console.log(teams)
    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await teamService.getTeams();
            setTeams(response.data.teams);
        } catch (error: any) {
            message.error('Failed to load teams');
            console.error('Teams fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleDeleteClick = (team: Team) => {
        setTeamToDelete(team);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (!teamToDelete) return;
        console.log('Deleting team with id:', teamToDelete);
        try {
            setDeleteLoading(true);
            await teamService.deleteTeam(teamToDelete.id);
            
            // Log activity
            await activityLogService.createActivityLog({
                message: `Team "${teamToDelete.name}" was deleted`,
                entity: 'team',
                entityId: teamToDelete.id,
                team: teamToDelete.id,
            });
            
            message.success('Team deleted successfully');
            setDeleteModalVisible(false);
            setTeamToDelete(null);
            fetchTeams();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Failed to delete team';
            message.error(errorMsg);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (team: Team) => {
        setSelectedTeam(team);
        setEditModalVisible(true);
    };

    const handleView = (teamId: string) => {
        navigate(`/teams/${teamId}`);
    };

    const handleTeamCreated = () => {
        fetchTeams();
    };

    const columns: ColumnsType<Team> = [
        {
            title: 'Team Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Team) => (
                <div className="flex items-center">
                    <TeamOutlined className="mr-2 text-primary" />
                    <span 
                        className="font-medium cursor-pointer hover:text-primary hover:underline"
                        onClick={() => handleView(record.id)}
                    >
                        {name}
                    </span>
                </div>
            ),
        },
        {
            title: 'Members',
            dataIndex: 'members',
            key: 'members',
            align: 'center',
            render: (members: Team['members']) => (
                <Tag color="blue">{members.length} {members.length === 1 ? 'member' : 'members'}</Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true }),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 100,
            fixed: 'right' as const,
            render: (_: any, record: Team) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: 'View Details',
                                icon: <EyeOutlined />,
                                onClick: () => handleView(record.id),
                            },
                            {
                                key: 'edit',
                                label: 'Edit Team',
                                icon: <EditOutlined />,
                                onClick: () => handleEdit(record),
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'delete',
                                label: 'Delete Team',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDeleteClick(record),
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

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
                        Teams
                    </Title>
                    <p className="text-text-muted text-sm md:text-base">Manage your teams and team members</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setCreateModalVisible(true)}
                    className="w-full sm:w-auto"
                >
                    Create Team
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={teams}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 768 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} teams`,
                        responsive: true,
                    }}
                />
            </div>

            <CreateTeamModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSuccess={handleTeamCreated}
            />

            <EditTeamModal
                visible={editModalVisible}
                onClose={() => {
                    setEditModalVisible(false);
                    setSelectedTeam(null);
                }}
                onSuccess={fetchTeams}
                team={selectedTeam}
            />

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <ExclamationCircleOutlined className="text-red-500" />
                        <span>Delete Team</span>
                    </div>
                }
                open={deleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setTeamToDelete(null);
                }}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: deleteLoading }}
                cancelButtonProps={{ disabled: deleteLoading }}
                confirmLoading={deleteLoading}
                centered
            >
                <p className="text-text-primary my-4">
                    Are you sure you want to delete <strong>{teamToDelete?.name}</strong>?
                </p>
                <p className="text-text-muted text-sm">
                    This action cannot be undone. All team members will be removed, but assigned tasks will remain.
                </p>
            </Modal>
        </div>
    );
};
