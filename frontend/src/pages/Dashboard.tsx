import React from 'react';
import { Card, Row, Col, Statistic, Typography, Empty } from 'antd';
import {
  ProjectOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-2">
          Dashboard
        </Title>
        <p className="text-text-muted">Welcome back! Here's an overview of your workspace.</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={0}
              prefix={<ProjectOutlined className="text-primary" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={0}
              prefix={<CheckSquareOutlined className="text-primary" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Teams"
              value={0}
              prefix={<TeamOutlined className="text-primary" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={0}
              prefix={<ClockCircleOutlined className="text-primary" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Team Workload */}
      <Card title="Team Workload">
        <Empty description="No team data available" />
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <Empty description="No recent activity" />
      </Card>
    </div>
  );
};
