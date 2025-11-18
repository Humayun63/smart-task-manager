import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { teamService } from '../../services';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamId: string;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  visible,
  onClose,
  onSuccess,
  teamId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Backend expects an array of members
      await teamService.addMembers(teamId, { members: [values] });
      
      message.success('Member added successfully');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.errorFields) return; // Form validation error
      const errorMsg = error.response?.data?.message || 'Failed to add member';
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
          <UserAddOutlined className="mr-2 text-primary" />
          <span>Add Team Member</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Add Member
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Member Name"
          rules={[
            { required: true, message: 'Please enter member name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter member name" size="large" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[
            { required: true, message: 'Please enter role' },
            { min: 2, message: 'Role must be at least 2 characters' },
          ]}
        >
          <Input placeholder="e.g., Developer, Designer, Manager" size="large" />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Task Capacity"
          rules={[
            { required: true, message: 'Please enter capacity' },
            { type: 'number', min: 1, message: 'Capacity must be at least 1' },
          ]}
        >
          <InputNumber
            placeholder="Maximum number of tasks"
            size="large"
            min={1}
            max={100}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
