import api from './api';
import type { ActivityLog } from '../types';

interface GetActivityLogsParams {
  team?: string;
  project?: string;
  task?: string;
  page?: number;
  limit?: number;
}

// Transform function to convert _id to id
const transformActivityLog = (log: any): ActivityLog => {
  return {
    ...log,
    id: log._id || log.id,
    project: log.project ? {
      id: log.project._id || log.project.id,
      name: log.project.name,
    } : null,
    task: log.task ? {
      id: log.task._id || log.task.id,
      title: log.task.title,
    } : null,
    team: log.team ? {
      id: log.team._id || log.team.id,
      name: log.team.name,
    } : null,
    createdBy: {
      id: log.createdBy._id || log.createdBy.id,
      name: log.createdBy.name,
      email: log.createdBy.email,
    },
  };
};

const transformActivityLogs = (logs: any[]): ActivityLog[] => {
  return logs.map(transformActivityLog);
};

class ActivityLogService {
  async getActivityLogs(params?: GetActivityLogsParams) {
    const response = await api.get<{ logs: any[]; total: number }>('/activity-log', { params });
    return {
      ...response,
      data: {
        logs: transformActivityLogs(response.data.logs),
        total: response.data.total,
      },
    };
  }

  async createActivityLog(data: {
    message: string;
    entity: string;
    entityId: string;
    project?: string;
    task?: string;
    team?: string;
  }) {
    const response = await api.post<{ log: any }>('/activity-log', data);
    return {
      ...response,
      data: {
        log: transformActivityLog(response.data.log),
      },
    };
  }
}

export const activityLogService = new ActivityLogService();
