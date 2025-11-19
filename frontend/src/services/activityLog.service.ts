// @ts-nocheck
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
    project: log.projectId ? {
      id: log.projectId._id || log.projectId.id,
      name: log.projectId.name,
    } : null,
    task: log.taskId ? {
      id: log.taskId._id || log.taskId.id,
      title: log.taskId.title,
    } : null,
    team: log.teamId ? {
      id: log.teamId._id || log.teamId.id,
      name: log.teamId.name,
    } : null,
    createdBy: {
      id: log.createdBy._id || log.createdBy.id,
      name: log.createdBy.name,
      email: log.createdBy.email,
    },
    createdAt: log.timestamp || log.createdAt,
    updatedAt: log.timestamp || log.updatedAt,
    message: log.message,
    entity: log.entity || 'unknown',
    entityId: log.entityId || log._id,
  };
};

const transformActivityLogs = (logs: any[]): ActivityLog[] => {
  return logs.map(transformActivityLog);
};

class ActivityLogService {
  async getActivityLogs(params?: GetActivityLogsParams) {
    const response = await api.get<{ logs: any[]; total: number }>('/activity-log', { params });
    console.log(response)
    return {
      ...response.data,
      data: {
        logs: transformActivityLogs(response.data.data.logs),
        total: response.data.data?.count,
      },
    };
  }

  async createActivityLog(data: {
    message: string;
    entity?: string;
    entityId?: string;
    project?: string;
    task?: string;
    team?: string;
  }) {
    // Map frontend field names to backend field names
    const backendData = {
      message: data.message,
      projectId: data.project,
      taskId: data.task,
      teamId: data.team,
    };
    
    const response = await api.post('/activity-log', backendData);
    return {
      ...response,
      data: {
        log: transformActivityLog(response.data.data?.log || response.data.log),
      },
    };
  }
}

export const activityLogService = new ActivityLogService();
