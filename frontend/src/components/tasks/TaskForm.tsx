import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card, Modal, Alert } from 'antd';
import {
  ExclamationCircleOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { taskService, projectService, teamService, activityLogService } from '../../services';
import type { Project, TeamMember, CreateTaskData, UpdateTaskData, Task } from '../../types';

const { TextArea } = Input;

interface TaskFormProps {
  task?: Task | null;
  mode: 'create' | 'edit';
  preSelectedProjectId?: string;
  onSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, mode, preSelectedProjectId, onSuccess }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [memberWorkloads, setMemberWorkloads] = useState<Record<string, number>>({});
  const [overloadModalVisible, setOverloadModalVisible] = useState(false);
  const [overloadedMember, setOverloadedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchProjects();
    
    if (task && mode === 'edit') {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        project: task.project.id,
        assignedMember: task.assignedMember?.id,
      });
      loadProjectTeam(task.project.id);
    } else if (preSelectedProjectId && mode === 'create') {
      form.setFieldValue('project', preSelectedProjectId);
      loadProjectTeam(preSelectedProjectId);
    }
  }, [task, mode, preSelectedProjectId]);

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data.projects);
    } catch (error: any) {
      message.error('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadProjectTeam = async (projectId: string) => {
    try {
      setMembersLoading(true);
      let project = projects.find((p) => p.id === projectId);
      
      // If project not in list yet, fetch it directly
      if (!project) {
        const projectResponse = await projectService.getProject(projectId);
        project = projectResponse.data.project;
      }
      
      if (!project) return;

      setSelectedProject(project);
      const teamResponse = await teamService.getTeam(project.team.id);
      const members = teamResponse.data.team.members;
      setTeamMembers(members);

      // Calculate member workloads
      const tasksResponse = await taskService.getTasks({ project: projectId });
      const workloads: Record<string, number> = {};
      members.forEach((member) => {
        const memberTasks = tasksResponse.data.tasks.filter(
          (t) => t.assignedMember?.id === member.id && t.id !== task?.id
        );
        workloads[member.id] = memberTasks.length;
      });
      setMemberWorkloads(workloads);
    } catch (error: any) {
      message.error('Failed to load team members');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    form.setFieldValue('assignedMember', undefined);
    loadProjectTeam(projectId);
  };

  const handleAutoAssign = () => {
    if (teamMembers.length === 0) {
      message.warning('No team members available');
      return;
    }

    // Find member with lowest workload
    const memberWithLowestLoad = teamMembers.reduce((prev, current) => {
      const prevLoad = (memberWorkloads[prev.id] || 0) / prev.capacity;
      const currentLoad = (memberWorkloads[current.id] || 0) / current.capacity;
      return currentLoad < prevLoad ? current : prev;
    });

    form.setFieldValue('assignedMember', memberWithLowestLoad.id);
    message.success(`Auto-assigned to ${memberWithLowestLoad.name}`);
  };

  const checkMemberOverload = (memberId: string): boolean => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return false;

    const currentLoad = memberWorkloads[memberId] || 0;
    return currentLoad >= member.capacity;
  };

  const handleMemberChange = (memberId: string) => {
    if (checkMemberOverload(memberId)) {
      const member = teamMembers.find((m) => m.id === memberId);
      setOverloadedMember(member || null);
      setOverloadModalVisible(true);
    }
  };

  const handleOverloadConfirm = () => {
    setOverloadModalVisible(false);
    // Keep the assignment
  };

  const handleOverloadCancel = () => {
    form.setFieldValue('assignedMember', undefined);
    setOverloadedMember(null);
    setOverloadModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (mode === 'create') {
        const createData: CreateTaskData = {
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
          project: values.project,
          assignedMember: values.assignedMember,
        };
        const response = await taskService.createTask(createData);
        
        // Log activity
        await activityLogService.createActivityLog({
          message: `Task "${values.title}" was created`,
          entity: 'task',
          entityId: response.data.task.id,
          project: values.project,
          task: response.data.task.id,
          team: selectedProject?.team.id,
        });
        
        message.success('Task created successfully');
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/tasks');
        }
      } else if (task) {
        const updateData: UpdateTaskData = {
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
          assignedMember: values.assignedMember,
        };
        await taskService.updateTask(task.id, updateData);
        
        // Log activity
        let logMessage = `Task "${values.title}" was updated`;
        if (task.status !== values.status) {
          logMessage = `Task "${values.title}" status changed from ${task.status} to ${values.status}`;
        }
        
        await activityLogService.createActivityLog({
          message: logMessage,
          entity: 'task',
          entityId: task.id,
          project: task.project.id,
          task: task.id,
          team: task.team.id,
        });
        
        message.success('Task updated successfully');
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/tasks');
        }
      }
    } catch (error: any) {
      if (error.errorFields) return;
      const errorMsg = error.response?.data?.message || `Failed to ${mode} task`;
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getMemberWorkloadDisplay = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return '';

    const currentLoad = memberWorkloads[memberId] || 0;
    const isOverloaded = currentLoad >= member.capacity;
    const percentage = Math.round((currentLoad / member.capacity) * 100);

    return (
      <div className="flex items-center justify-between w-full">
        <span>{member.name}</span>
        <span
          className={`text-xs ml-2 ${
            isOverloaded ? 'text-red-500 font-semibold' : 'text-text-muted'
          }`}
        >
          {currentLoad}/{member.capacity} ({percentage}%)
        </span>
      </div>
    );
  };

  return (
    <>
      <Card className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[
              { required: true, message: 'Please enter task title' },
              { min: 3, message: 'Title must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter task title" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: false },
            ]}
          >
            <TextArea placeholder="Enter task description (optional)" rows={4} size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority" size="large">
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status" size="large">
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Done">Done</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="project"
            label="Project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select
              placeholder="Select a project"
              size="large"
              loading={projectsLoading}
              onChange={handleProjectChange}
              disabled={mode === 'edit'}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={projects.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
            />
          </Form.Item>

          {teamMembers.length > 0 && (
            <>
              <Form.Item label="Assign Member">
                <div className="flex gap-2 mb-2">
                  <Button
                    icon={<RobotOutlined />}
                    onClick={handleAutoAssign}
                    disabled={membersLoading}
                  >
                    Auto Assign
                  </Button>
                </div>
                <Form.Item
                  name="assignedMember"
                  noStyle
                  rules={[{ required: false }]}
                >
                  <Select
                    placeholder="Select team member (optional)"
                    size="large"
                    loading={membersLoading}
                    allowClear
                    onChange={handleMemberChange}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {teamMembers.map((member) => (
                      <Select.Option key={member.id} value={member.id} label={member.name}>
                        {getMemberWorkloadDisplay(member.id)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form.Item>

              {selectedProject && (
                <Alert
                  message={`Team: ${selectedProject.team.name}`}
                  type="info"
                  showIcon
                  icon={<UserOutlined />}
                  className="mb-4"
                />
              )}
            </>
          )}

          <div className="flex gap-4 justify-end pt-4">
            <Button size="large" onClick={() => navigate('/tasks')}>
              Cancel
            </Button>
            <Button type="primary" size="large" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Overload Warning Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-orange-500" />
            <span>Member Overloaded</span>
          </div>
        }
        open={overloadModalVisible}
        onOk={handleOverloadConfirm}
        onCancel={handleOverloadCancel}
        okText="Assign Anyway"
        cancelText="Choose Another"
        centered
      >
        {overloadedMember && (
          <div className="my-4">
            <p className="text-text-primary mb-2">
              <strong>{overloadedMember.name}</strong> has{' '}
              <strong className="text-orange-500">
                {memberWorkloads[overloadedMember.id] || 0} task(s)
              </strong>{' '}
              but capacity is <strong>{overloadedMember.capacity}</strong>.
            </p>
            <p className="text-text-muted text-sm">
              Assigning this task will overload the team member. Consider choosing another member
              or use the Auto Assign feature.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};
