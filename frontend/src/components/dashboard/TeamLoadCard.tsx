import React from 'react';
import { Card, Table, Badge, Button, Progress, Empty } from 'antd';
import { WarningOutlined, SwapOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TeamMemberSummary } from '../../types';

interface TeamLoadCardProps {
  teamMembers: TeamMemberSummary[];
  loading?: boolean;
  onReassign?: (memberId: string, memberName: string) => void;
}

export const TeamLoadCard: React.FC<TeamLoadCardProps> = ({
  teamMembers,
  loading = false,
  onReassign,
}) => {
  const columns: ColumnsType<TeamMemberSummary> = [
    {
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName',
      render: (name: string, record: TeamMemberSummary) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-text-muted">{record.memberRole}</div>
        </div>
      ),
    },
    {
      title: 'Tasks',
      dataIndex: 'currentTasks',
      key: 'currentTasks',
      width: 100,
      align: 'center',
      render: (tasks: number, record: TeamMemberSummary) => (
        <span className={record.overloaded ? 'text-red-500 font-semibold' : ''}>
          {tasks} / {record.capacity}
        </span>
      ),
    },
    {
      title: 'Workload',
      key: 'workload',
      width: 200,
      render: (_: any, record: TeamMemberSummary) => {
        const percentage = Math.min((record.currentTasks / record.capacity) * 100, 100);
        const status = record.overloaded ? 'exception' : percentage > 80 ? 'normal' : 'active';
        
        return (
          <Progress 
            percent={Math.round(percentage)} 
            status={status}
            size="small"
          />
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_: any, record: TeamMemberSummary) => {
        if (record.overloaded) {
          return (
            <Badge 
              status="error" 
              text={<span className="text-red-500 font-semibold">Overloaded</span>}
            />
          );
        }
        
        const percentage = (record.currentTasks / record.capacity) * 100;
        if (percentage > 80) {
          return <Badge status="warning" text="High Load" />;
        }
        
        return <Badge status="success" text="Normal" />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_: any, record: TeamMemberSummary) => {
        if (record.overloaded && onReassign) {
          return (
            <Button
              type="primary"
              size="small"
              danger
              icon={<SwapOutlined />}
              onClick={() => onReassign(record.memberId, record.memberName)}
            >
              Reassign
            </Button>
          );
        }
        return null;
      },
    },
  ];

  const overloadedCount = teamMembers.filter(m => m.overloaded).length;

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span>Team Workload</span>
          {overloadedCount > 0 && (
            <Badge 
              count={`${overloadedCount} Overloaded`} 
              style={{ backgroundColor: '#ff4d4f' }}
            />
          )}
        </div>
      }
      extra={
        overloadedCount > 0 && (
          <div className="flex items-center text-red-500">
            <WarningOutlined className="mr-1" />
            <span className="text-sm font-medium">Action Required</span>
          </div>
        )
      }
      loading={loading}
    >
      {!loading && (teamMembers.length === 0 ? (
        <Empty description="No team members found" />
      ) : (
        <Table
          columns={columns}
          dataSource={teamMembers}
          rowKey="memberId"
          pagination={false}
          size="middle"
        />
      ))}
    </Card>
  );
};
