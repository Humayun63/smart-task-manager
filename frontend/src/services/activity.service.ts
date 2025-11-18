import api from './api';
import type {
  ActivityLog,
  CreateActivityLogData,
  ActivityLogFilters,
  ApiResponse,
} from '../types';

export const activityService = {
  async createLog(data: CreateActivityLogData): Promise<ApiResponse<{ log: ActivityLog }>> {
    const response = await api.post<ApiResponse<{ log: ActivityLog }>>('/activity-log', data);
    return response.data;
  },

  async getLogs(filters?: ActivityLogFilters): Promise<ApiResponse<{ logs: ActivityLog[] }>> {
    const params = new URLSearchParams();
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.taskId) params.append('taskId', filters.taskId);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<{ logs: ActivityLog[] }>>(
      `/activity-log?${params.toString()}`
    );
    return response.data;
  },

  async getLog(logId: string): Promise<ApiResponse<{ log: ActivityLog }>> {
    const response = await api.get<ApiResponse<{ log: ActivityLog }>>(`/activity-log/${logId}`);
    return response.data;
  },
};
