import React, { useState } from 'react';
import { Modal, Form, Select, Button, message, Space } from 'antd';
import { SwapOutlined, RobotOutlined, UserDeleteOutlined } from '@ant-design/icons';
import type { TeamMemberSummary } from '../../types';

interface TaskReassignModalProps {
    visible: boolean;
    onClose: () => void;
    fromMember: {
        id: string;
        name: string;
    } | null;
    teamMembers: TeamMemberSummary[];
    onConfirm: (toMemberId: string | null, action: 'assign' | 'auto' | 'unassign') => Promise<void>;
}

export const TaskReassignModal: React.FC<TaskReassignModalProps> = ({
    visible,
    onClose,
    fromMember,
    teamMembers,
    onConfirm,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<'assign' | 'auto' | 'unassign' | null>(null);

    const handleAssignTo = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            setActionType('assign');
            await onConfirm(values.toMemberId, 'assign');
            message.success('Tasks reassigned successfully');
            form.resetFields();
            onClose();
        } catch (error: any) {
            if (error.errorFields) {
                // Form validation error
                return;
            }
            message.error('Failed to reassign tasks');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleAutoAssign = async () => {
        try {
            setLoading(true);
            setActionType('auto');
            await onConfirm(null, 'auto');
            message.success('Tasks automatically reassigned');
            form.resetFields();
            onClose();
        } catch (error: any) {
            message.error('Failed to auto-reassign tasks');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleUnassign = async () => {
        try {
            setLoading(true);
            setActionType('unassign');
            await onConfirm(null, 'unassign');
            message.success('Tasks unassigned successfully');
            form.resetFields();
            onClose();
        } catch (error: any) {
            message.error('Failed to unassign tasks');
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    // Filter out the current member and overloaded members
    const availableMembers = teamMembers.filter(
        (m) => m.memberId !== fromMember?.id && !m.overloaded
    );

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <SwapOutlined className="mr-2 text-primary" />
                    <span>Reassign Tasks</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>,
            ]}
            width={600}
        >
            <div className="mb-4">
                <p className="text-text-muted">
                    Reassign tasks from <strong>{fromMember?.name}</strong>.
                </p>
                <p className="text-sm text-orange-500 mt-2">
                    ⚠️ Choose an option to redistribute the workload.
                </p>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="toMemberId"
                    label="Assign To Specific Member"
                    rules={[{ required: false }]}
                >
                    <Select
                        placeholder="Select team member"
                        size="large"
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={availableMembers.map((member) => ({
                            value: member.memberId,
                            label: `${member.memberName} (${member.currentTasks}/${member.capacity} tasks)`,
                        }))}
                    />
                </Form.Item>
            </Form>

            <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-3">Actions:</p>
                <Space direction="vertical" className="w-full" size="middle">
                    <Button
                        type="default"
                        size="large"
                        block
                        icon={<SwapOutlined />}
                        loading={loading && actionType === 'assign'}
                        disabled={loading && actionType !== 'assign'}
                        onClick={handleAssignTo}
                    >
                        Assign To Selected Member
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        block
                        icon={<RobotOutlined />}
                        loading={loading && actionType === 'auto'}
                        disabled={loading && actionType !== 'auto'}
                        onClick={handleAutoAssign}
                    >
                        Auto Assign (Balance Workload)
                    </Button>
                    <Button
                        type="default"
                        danger
                        size="large"
                        block
                        icon={<UserDeleteOutlined />}
                        loading={loading && actionType === 'unassign'}
                        disabled={loading && actionType !== 'unassign'}
                        onClick={handleUnassign}
                    >
                        Unassign All Tasks
                    </Button>
                </Space>
            </div>

            {availableMembers.length === 0 && (
                <div className="text-center py-2 text-text-muted text-sm bg-gray-50 dark:bg-gray-800 rounded">
                    No available team members for manual assignment.
                </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                <p className="text-text-primary mb-2"><strong>Options explained:</strong></p>
                <ul className="text-text-muted space-y-1 list-disc list-inside">
                    <li><strong>Assign To:</strong> Manually assign all tasks to the selected member</li>
                    <li><strong>Auto Assign:</strong> Automatically distribute tasks to balance team workload</li>
                    <li><strong>Unassign:</strong> Remove assignment from all tasks (tasks remain in project)</li>
                </ul>
            </div>
        </Modal>
    );
};
