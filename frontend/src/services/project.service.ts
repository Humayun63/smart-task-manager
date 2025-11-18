import api from './api';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ApiResponse,
} from '../types';

// Transform backend _id to frontend id
const transformProject = (project: any): Project => ({
  ...project,
  id: project.id || project._id,
  team: {
    id: project.team._id,
    name: project.team.name,
  },
  owner: {
    id: project.owner._id,
    name: project.owner.name,
    email: project.owner.email,
  },
});

const transformProjects = (projects: any[]): Project[] => projects.map(transformProject);

export const projectService = {
  async createProject(data: CreateProjectData): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.post('/projects', data);
    return {
      ...response.data,
      data: {
        project: transformProject(response.data.data.project),
      },
    };
  },

  async getProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    const response = await api.get('/projects');
    return {
      ...response.data,
      data: {
        projects: transformProjects(response.data.data.projects),
      },
    };
  },

  async getProject(projectId: string): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.get(`/projects/${projectId}`);
    return {
      ...response.data,
      data: {
        project: transformProject(response.data.data.project),
      },
    };
  },

  async updateProject(
    projectId: string,
    data: UpdateProjectData
  ): Promise<ApiResponse<{ project: Project }>> {
    const response = await api.put(`/projects/${projectId}`, data);
    return {
      ...response.data,
      data: {
        project: transformProject(response.data.data.project),
      },
    };
  },

  async deleteProject(projectId: string): Promise<ApiResponse> {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },
};
