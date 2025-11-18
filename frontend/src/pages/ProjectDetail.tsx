import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Descriptions,
  message,
  Spin,
  Tag,
  Statistic,
  Row,
  Col,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { projectService, taskService } from '../services';
import type { Project, Task } from '../types';
import { EditProjectModal } from '../components/projects';
import { formatDistanceToNow } from 'date-fns';

const { Title, Paragraph } = Typography;

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchProjectDetails = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const [projectResponse, tasksResponse] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getTasks({ project: projectId }),
      ]);

      setProject(projectResponse.data.project);
      setTasks(tasksResponse.data.tasks);
    } catch (error: any) {
      message.error('Failed to load project details');
      console.error('Project detail fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

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

  const completedTasks = tasks.filter((task) => task.status === 'Done').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/projects')}
          className="!p-0 mb-4"
        >
          Back to Projects
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ProjectOutlined className="text-2xl text-primary" />
              <Title level={2} className="!mb-0 !text-xl md:!text-2xl">
                {project.name}
              </Title>
            </div>
            <Paragraph className="text-text-muted text-sm md:text-base mb-0">
              {project.description}
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="large"
            onClick={() => setEditModalVisible(true)}
            className="w-full sm:w-auto"
          >
            Edit Project
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card title="Project Information" className="shadow-sm">
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <TeamOutlined className="text-blue-500" />
                Team
              </span>
            }
          >
            <Tag color="blue" className="text-sm">
              {project.team.name}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <UserOutlined className="text-green-500" />
                Owner
              </span>
            }
          >
            <div>
              <div className="font-medium">{project.owner.name}</div>
              <div className="text-xs text-text-muted">{project.owner.email}</div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2">
                <CalendarOutlined className="text-purple-500" />
                Created
              </span>
            }
          >
            {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Task Summary */}
      <Card title="Task Summary" className="shadow-sm">
        {tasks.length > 0 ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="bg-green-50 dark:bg-green-900/20">
                <Statistic
                  title="Completed Tasks"
                  value={completedTasks}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  suffix={`/ ${tasks.length}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="bg-blue-50 dark:bg-blue-900/20">
                <Statistic
                  title="In Progress"
                  value={inProgressTasks}
                  prefix={<ClockCircleOutlined className="text-blue-500" />}
                  suffix={`/ ${tasks.length}`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="bg-orange-50 dark:bg-orange-900/20">
                <Statistic
                  title="Pending Tasks"
                  value={pendingTasks}
                  prefix={<ClockCircleOutlined className="text-orange-500" />}
                  suffix={`/ ${tasks.length}`}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <Empty
            description="No tasks in this project yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {projectId && (
        <EditProjectModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSuccess={fetchProjectDetails}
          project={project}
        />
      )}
    </div>
  );
};
