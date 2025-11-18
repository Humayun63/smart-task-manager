import React from 'react';
import { Card, Button, Typography, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const Teams: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Teams
          </Title>
          <p className="text-text-muted">Manage your teams and team members.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Team
        </Button>
      </div>

      <Card>
        <Empty description="No teams yet. Create your first team to get started!" />
      </Card>
    </div>
  );
};
