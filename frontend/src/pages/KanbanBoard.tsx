import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Card,
  Tag,
  message,
  Spin,
  Empty,
  Avatar,
  Dropdown,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { taskService, projectService } from '../services';
import type { Task, TaskStatus, TaskPriority, Project } from '../types';

const { Title } = Typography;

const STATUS_COLUMNS: { key: TaskStatus; title: string; color: string }[] = [
  { key: 'Pending', title: 'Pending', color: 'bg-gray-100 dark:bg-gray-800' },
  { key: 'In Progress', title: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'Done', title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' },
];

export const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getProjectTasks(projectId),
      ]);

      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (error: any) {
      message.error('Failed to load kanban board');
      console.error('Kanban fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
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

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Project not found</p>
        <Button type="link" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/projects/${projectId}`)}
          className="!p-0 mb-4"
        >
          Back to Project
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
              {project.name} - Kanban Board
            </Title>
            <p className="text-text-muted text-sm md:text-base">
              Visualize and manage tasks across different stages
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreateTask}
            className="w-full sm:w-auto"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUS_COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.key);

          return (
            <div key={column.key} className="flex flex-col">
              {/* Column Header */}
              <Card
                className={`${column.color} mb-4 shadow-sm`}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">{column.title}</h3>
                  <Tag color="default">{columnTasks.length}</Tag>
                </div>
              </Card>

              {/* Task Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      hoverable
                      className="shadow-sm cursor-pointer"
                      bodyStyle={{ padding: '16px' }}
                      onClick={() => handleEditTask(task.id)}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-sm flex-1 pr-2">
                          {task.title}
                        </h4>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'edit',
                                label: 'Edit Task',
                                icon: <EditOutlined />,
                                onClick: (e) => {
                                  e.domEvent.stopPropagation();
                                  handleEditTask(task.id);
                                },
                              },
                            ],
                          }}
                          trigger={['click']}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<MoreOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Dropdown>
                      </div>

                      {/* Task Description */}
                      <p className="text-xs text-text-muted line-clamp-2 mb-3">
                        {task.description}
                      </p>

                      {/* Task Footer */}
                      <div className="flex items-center justify-between">
                        {/* Assignee */}
                        {task.assignedMember ? (
                          <div className="flex items-center gap-2">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <span className="text-xs text-text-muted">
                              {task.assignedMember.name}
                            </span>
                          </div>
                        ) : (
                          <Tag className="text-xs">Unassigned</Tag>
                        )}

                        {/* Priority Tag */}
                        <Tag color={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Tag>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-sm">
                    <Empty
                      description={`No ${column.title.toLowerCase()} tasks`}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{tasks.length}</div>
            <div className="text-sm text-text-muted">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-500">
              {getTasksByStatus('Pending').length}
            </div>
            <div className="text-sm text-text-muted">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">
              {getTasksByStatus('In Progress').length}
            </div>
            <div className="text-sm text-text-muted">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {getTasksByStatus('Done').length}
            </div>
            <div className="text-sm text-text-muted">Completed</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
