import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { teamService } from '../../services';
import type { Team } from '../../types';

interface EditTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  team: Team | null;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  visible,
  onClose,
  onSuccess,
  team,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team && visible) {
      form.setFieldsValue({
        name: team.name,
      });
    }
  }, [team, visible, form]);

  const handleSubmit = async () => {
    if (!team) return;

    try {
      const values = await form.validateFields();
      setLoading(true);
      await teamService.updateTeam(team.id, values);
      message.success('Team updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.errorFields) return; // Form validation error
      const errorMsg = error.response?.data?.message || 'Failed to update team';
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
          <EditOutlined className="mr-2 text-primary" />
          <span>Edit Team</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Update Team
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
