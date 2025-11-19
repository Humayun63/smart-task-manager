import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TaskForm } from '../components/tasks';
import { taskService } from '../services';
import type { Task } from '../types';

const { Title } = Typography;

export const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const response = await taskService.getTask(taskId);
      setTask(response.data.task);
    } catch (error: any) {
      message.error('Failed to load task');
      console.error('Task fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Task not found</p>
        <Button type="link" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/tasks')}
          className="!p-0 mb-4"
        >
          Back to Tasks
        </Button>
        <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
          Edit Task
        </Title>
        <p className="text-text-muted text-sm md:text-base">
          Update task details and reassign members
        </p>
      </div>

      <TaskForm mode="edit" task={task} />
    </div>
  );
};
