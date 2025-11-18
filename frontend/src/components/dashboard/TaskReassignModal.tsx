import React, { useState } from 'react';
import { Modal, Form, Select, Button, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import type { TeamMemberSummary } from '../../types';

interface TaskReassignModalProps {
    visible: boolean;
    onClose: () => void;
    fromMember: {
        _id: string;
        name: string;
    } | null;
    teamMembers: TeamMemberSummary[];
    onConfirm: (toMemberId: string) => Promise<void>;
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

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await onConfirm(values.toMemberId);
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
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    // Filter out the current member and overloaded members
    const availableMembers = teamMembers.filter(
        (m) => m.memberId !== fromMember?._id && !m.overloaded
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
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    icon={<SwapOutlined />}
                >
                    Confirm Reassignment
                </Button>,
            ]}
            width={500}
        >
            <div className="mb-4">
                <p className="text-text-muted">
                    Reassign tasks from <strong>{fromMember?.name}</strong> to another team member.
                </p>
                <p className="text-sm text-red-500 mt-2">
                    ⚠️ This will transfer all tasks from the overloaded member to the selected member.
                </p>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="toMemberId"
                    label="Assign To"
                    rules={[{ required: true, message: 'Please select a team member' }]}
                >
                    <Select
                        placeholder="Select team member"
                        size="large"
                        showSearch
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

            {availableMembers.length === 0 && (
                <div className="text-center py-4 text-text-muted">
                    No available team members for reassignment.
                </div>
            )}
        </Modal>
    );
};
