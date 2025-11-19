import React from 'react';
import { Card, Timeline, Empty, Typography } from 'antd';
import { ClockCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import type { RecentReassignment } from '../../types';

const { Text } = Typography;

interface RecentReassignmentsProps {
  reassignments: RecentReassignment[];
  loading?: boolean;
}

export const RecentReassignments: React.FC<RecentReassignmentsProps> = ({
  reassignments,
  loading = false,
}) => {
  if (!loading && reassignments.length === 0) {
    return (
      <Card title="Recent Reassignment">
        <Empty description="No Recent Reassignment logs" />
      </Card>
    );
  }

  return (
    <Card 
      title="Recent Reassignment" 
      loading={loading}
      extra={<Text type="secondary">Last 5 activities</Text>}
    >
      <Timeline
        items={reassignments.map((item) => ({
          dot: <SwapOutlined className="text-primary" />,
          children: (
            <div key={item.id}>
              <div className="mb-1">
                <Text>{item.message}</Text>
              </div>
              <div className="flex items-center text-text-muted text-sm">
                <ClockCircleOutlined className="mr-1" />
                <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          ),
        }))}
      />
    </Card>
  );
};
