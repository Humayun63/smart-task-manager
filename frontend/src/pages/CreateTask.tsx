import React from 'react';
import { Typography } from 'antd';
import { TaskForm } from '../components/tasks';

const { Title } = Typography;

export const CreateTask: React.FC = () => {
  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
          Create New Task
        </Title>
        <p className="text-text-muted text-sm md:text-base">
          Create a new task and assign it to a team member
        </p>
      </div>

      <TaskForm mode="create" />
    </div>
  );
};
