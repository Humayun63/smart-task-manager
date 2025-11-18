import React from 'react';
import { Card, Typography, Empty, Timeline, Space, Select } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export const ActivityLog: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-2">
          Activity Log
        </Title>
        <p className="text-text-muted">Track all activities and changes in your workspace.</p>
      </div>

      {/* Filters */}
      <Card>
        <Space wrap>
          <Select placeholder="Filter by Team" style={{ width: 200 }} allowClear />
          <Select placeholder="Filter by Project" style={{ width: 200 }} allowClear />
          <Select placeholder="Filter by Task" style={{ width: 200 }} allowClear />
        </Space>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <Empty
          description="No activity logs yet"
          image={<ClockCircleOutlined style={{ fontSize: 48 }} className="text-text-muted" />}
        />
      </Card>
    </div>
  );
};
