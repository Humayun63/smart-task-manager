import React from 'react';
import { Card, Button, Typography, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const Projects: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Projects
          </Title>
          <p className="text-text-muted">Organize your work into projects.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Project
        </Button>
      </div>

      <Card>
        <Empty description="No projects yet. Create your first project to get started!" />
      </Card>
    </div>
  );
};
