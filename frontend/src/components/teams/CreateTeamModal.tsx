import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { teamService, activityLogService } from '../../services';

interface CreateTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (teamId: string) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await teamService.createTeam(values);
      
      // Log activity
      await activityLogService.createActivityLog({
        message: `Team "${values.name}" was created`,
        entity: 'team',
        entityId: response.data.team.id,
        team: response.data.team.id,
      });
      
      message.success('Team created successfully');
      form.resetFields();
      onClose();
      onSuccess(response.data.team.id);
    } catch (error: any) {
      if (error.errorFields) return; // Form validation error
      const errorMsg = error.response?.data?.message || 'Failed to create team';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <TeamOutlined className="mr-2 text-primary" />
          <span>Create New Team</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Create Team
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Team Name"
          rules={[
            { required: true, message: 'Please enter team name' },
            { min: 2, message: 'Team name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter team name" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
