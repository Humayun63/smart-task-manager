// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, message, Spin } from 'antd';
import { ClockCircleOutlined, ProjectOutlined, CheckSquareOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { activityLogService, teamService, projectService, taskService } from '../services';
import type { ActivityLog as ActivityLogType, Team, Project, Task } from '../types';
import { format } from 'date-fns';

const { Title } = Typography;

export const ActivityLog: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [filters, setFilters] = useState({
    team: undefined as string | undefined,
    project: undefined as string | undefined,
    task: undefined as string | undefined,
  });

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await activityLogService.getActivityLogs(filters);
      console.log(response.data);
      setLogs(response.data.logs);
    } catch (error: any) {
      message.error('Failed to load activity logs');
      console.error('Activity logs fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [teamsRes, projectsRes, tasksRes] = await Promise.all([
        teamService.getTeams(),
        projectService.getProjects(),
        taskService.getTasks(),
      ]);
      setTeams(teamsRes.data.teams);
      setProjects(projectsRes.data.projects);
      setTasks(tasksRes.data.tasks);
    } catch (error: any) {
      console.error('Failed to load filter options:', error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchActivityLogs();
  }, [filters]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns: ColumnsType<ActivityLogType> = [
    {
      title: 'Activity',
      dataIndex: 'message',
      key: 'message',
      width: '40%',
      render: (message: string, record) => (
        <div className="space-y-1">
          <p className="text-text-primary">{message}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {record.project && (
              <Tag
                icon={<ProjectOutlined />}
                color="blue"
                className="cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/projects/${record.project?.id}`)}
              >
                {record.project.name}
              </Tag>
            )}
            {record.task && (
              <Tag
                icon={<CheckSquareOutlined />}
                color="green"
                className="cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/tasks/${record.task?.id}/edit`)}
              >
                {record.task.title}
              </Tag>
            )}
            {record.team && (
              <Tag
                icon={<TeamOutlined />}
                color="purple"
                className="cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/teams/${record.team?.id}`)}
              >
                {record.team.name}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Created By',
      key: 'createdBy',
      width: 180,
      responsive: ['md'] as any,
      render: (_: any, record) => (
        <div>
          <p className="font-medium text-text-primary">{record.createdBy.name}</p>
          <p className="text-xs text-text-muted">{record.createdBy.email}</p>
        </div>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      responsive: ['sm'] as any,
      render: (date: string) => (
        <div className="text-sm">
          <p className="text-text-primary">{format(new Date(date), 'MMM dd, yyyy')}</p>
          <p className="text-xs text-text-muted">{format(new Date(date), 'hh:mm a')}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <Title level={2} className="!mb-2 !text-xl md:!text-2xl">
          Activity Log
        </Title>
        <p className="text-text-muted text-sm md:text-base">
          Track all activities and changes in your workspace.
        </p>
      </div>

      {/* Activity Log Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={logs}
              rowKey="id"
              scroll={{ x: 768 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} activities`,
                responsive: true,
              }}
              locale={{
                emptyText: (
                  <div className="py-8">
                    <ClockCircleOutlined className="text-4xl text-text-muted mb-2" />
                    <p className="text-text-muted">No activity logs yet</p>
                  </div>
                ),
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

