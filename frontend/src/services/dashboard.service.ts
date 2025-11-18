import api from './api';
import type { DashboardData, DashboardFilters, ApiResponse } from '../types';

export const dashboardService = {
  async getDashboard(filters?: DashboardFilters): Promise<ApiResponse<DashboardData>> {
    const params = new URLSearchParams();
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.projectId) params.append('projectId', filters.projectId);

    const response = await api.get<ApiResponse<DashboardData>>(`/dashboard?${params.toString()}`);
    return response.data;
  },
};
