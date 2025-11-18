import api from './api';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ApiResponse,
} from '../types';

export const projectService = {
  async createProject(data: CreateProjectData): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.post<ApiResponse<{ project: Project }>>('/projects', data);
    return response.data;
  },

  async getProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    const response = await api.get<ApiResponse<{ projects: Project[] }>>('/projects');
    return response.data;
  },

  async getProject(projectId: string): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.get<ApiResponse<{ project: Project }>>(`/projects/${projectId}`);
    return response.data;
  },

  async updateProject(
    projectId: string,
    data: UpdateProjectData
  ): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.put<ApiResponse<{ project: Project }>>(`/projects/${projectId}`, data);
    return response.data;
  },

  async deleteProject(projectId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/projects/${projectId}`);
    return response.data;
  },
};
