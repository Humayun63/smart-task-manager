import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { projectService, teamService } from '../../services';
import type { Project, Team } from '../../types';

const { TextArea } = Input;

interface EditProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  onClose,
  onSuccess,
  project,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchTeams();
      if (project) {
        form.setFieldsValue({
          name: project.name,
          description: project.description,
          team: project.team.id,
        });
      }
    }
  }, [project, visible, form]);

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
    if (!project) return;

    try {
      const values = await form.validateFields();
      setLoading(true);
      await projectService.updateProject(project.id, values);
      message.success('Project updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.errorFields) return; // Form validation error
      const errorMsg = error.response?.data?.message || 'Failed to update project';
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
          <span>Edit Project</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Update Project
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
            { required: false },
          ]}
        >
          <TextArea
            placeholder="Enter project description (optional)"
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
