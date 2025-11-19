import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Typography,
  message,
  Tag,
  Dropdown,
  Modal,
  Card,
  Input,
  Select,
  Space,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { taskService, projectService, teamService } from '../services';
import type { Task, Project, TeamMember, TaskPriority, TaskStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';

const { Title } = Typography;
const { Search } = Input;

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<{
    project?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    member?: string;
  }>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchText, filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes, teamsRes] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
        teamService.getTeams(),
      ]);

      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);

      // Collect all unique team members
      const allMembers: TeamMember[] = [];
      teamsRes.data.teams.forEach((team) => {
        team.members.forEach((member) => {
          if (!allMembers.find((m) => m.id === member.id)) {
            allMembers.push(member);
          }
        });
      });
      setTeamMembers(allMembers);
    } catch (error: any) {
      message.error('Failed to load tasks');
      console.error('Tasks fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }

    // Project filter
    if (filters.project) {
      filtered = filtered.filter((task) => task.project.id === filters.project);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Member filter
    if (filters.member) {
      filtered = filtered.filter((task) => task.assignedMember?.id === filters.member);
    }

    setFilteredTasks(filtered);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      setDeleteLoading(true);
      await taskService.deleteTask(taskToDelete.id);
      message.success('Task deleted successfully');
      setDeleteModalVisible(false);
      setTaskToDelete(null);
      fetchInitialData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to delete task';
      message.error(errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (taskId: string) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return 'success';
      case 'In Progress':
        return 'processing';
      case 'Pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Task) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-text-muted mt-1 line-clamp-1">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Project',
      dataIndex: ['project', 'name'],
      key: 'project',
      width: 150,
      responsive: ['md'] as any,
      render: (projectName: string) => (
        <div className="flex items-center">
          <ProjectOutlined className="mr-2 text-blue-500" />
          <span className="text-sm">{projectName}</span>
        </div>
      ),
    },
    {
      title: 'Assigned To',
      key: 'assignedMember',
      width: 150,
      responsive: ['lg'] as any,
      render: (_: any, record: Task) =>
        record.assignedMember ? (
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-green-500" />
            <span className="text-sm">{record.assignedMember.name}</span>
          </div>
        ) : (
          <Tag>Unassigned</Tag>
        ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      responsive: ['sm'] as any,
      render: (priority: TaskPriority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      responsive: ['md'] as any,
      render: (status: TaskStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      responsive: ['lg'] as any,
      render: (date: string) => (
        <span className="text-sm">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: Task) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Edit Task',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record.id),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'Delete Task',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteClick(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
            Tasks
          </Title>
          <p className="text-text-muted text-sm md:text-base">
            Track and manage all your tasks
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/tasks/create')}
          className="w-full sm:w-auto"
        >
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Space direction="vertical" size="middle" className="w-full">
          <Search
            placeholder="Search tasks..."
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space wrap>
            <Select
              placeholder="Filter by Project"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, project: value })}
              value={filters.project}
            >
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Status"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, status: value })}
              value={filters.status}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Done">Done</Select.Option>
            </Select>
            <Select
              placeholder="Filter by Priority"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, priority: value })}
              value={filters.priority}
            >
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
            <Select
              placeholder="Filter by Member"
              style={{ width: 200 }}
              allowClear
              showSearch
              onChange={(value) => setFilters({ ...filters, member: value })}
              value={filters.member}
              filterOption={(input, option) =>
                String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {teamMembers.map((member) => (
                <Select.Option key={member.id} value={member.id}>
                  {member.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Card>

      {/* Task List */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tasks`,
            responsive: true,
          }}
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500" />
            <span>Delete Task</span>
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setTaskToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelButtonProps={{ disabled: deleteLoading }}
        confirmLoading={deleteLoading}
        centered
      >
        <p className="text-text-primary my-4">
          Are you sure you want to delete <strong>{taskToDelete?.title}</strong>?
        </p>
        <p className="text-text-muted text-sm">
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
