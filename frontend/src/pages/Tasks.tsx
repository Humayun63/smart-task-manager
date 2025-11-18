import React from 'react';
import { Card, Button, Typography, Empty, Space, Select } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const Tasks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Tasks
          </Title>
          <p className="text-text-muted">Track and manage your tasks.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Space wrap>
          <Select placeholder="Filter by Project" style={{ width: 200 }} allowClear />
          <Select placeholder="Filter by Status" style={{ width: 200 }} allowClear />
          <Select placeholder="Filter by Priority" style={{ width: 200 }} allowClear />
          <Select placeholder="Filter by Member" style={{ width: 200 }} allowClear />
        </Space>
      </Card>

      {/* Task List */}
      <Card>
        <Empty description="No tasks yet. Create your first task to get started!" />
      </Card>
    </div>
  );
};
