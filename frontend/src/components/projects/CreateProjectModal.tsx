import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import { projectService, teamService } from '../../services';
import type { Team } from '../../types';

const { TextArea } = Input;

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchTeams();
    }
  }, [visible]);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const response = await teamService.getTeams();
      setTeams(response.data.teams);
    } catch (error: any) {
      message.error('Failed to load teams');
      console.error('Teams fetch error:', error);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await projectService.createProject(values);
      message.success('Project created successfully');
      form.resetFields();
      onClose();
      onSuccess(response.data.project.id);
    } catch (error: any) {
      if (error.errorFields) return; // Form validation error
      const errorMsg = error.response?.data?.message || 'Failed to create project';
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
          <ProjectOutlined className="mr-2 text-primary" />
          <span>Create New Project</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Create Project
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Project Name"
          rules={[
            { required: true, message: 'Please enter project name' },
            { min: 2, message: 'Project name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter project name" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter project description' },
            { min: 10, message: 'Description must be at least 10 characters' },
          ]}
        >
          <TextArea
            placeholder="Enter project description"
            rows={4}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="team"
          label="Assign Team"
          rules={[{ required: true, message: 'Please select a team' }]}
        >
          <Select
            placeholder="Select a team"
            size="large"
            loading={teamsLoading}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={teams.map((team) => ({
              value: team.id,
              label: team.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
