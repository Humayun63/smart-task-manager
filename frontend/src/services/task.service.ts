import api from './api';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  ApiResponse,
} from '../types';

export const taskService = {
  async createTask(data: CreateTaskData): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.post<ApiResponse<{ task: Task }>>('/tasks', data);
    return response.data;
  },

  async getTasks(filters?: TaskFilters): Promise<ApiResponse<{ tasks: Task[] }>> {
    const params = new URLSearchParams();
    if (filters?.project) params.append('project', filters.project);
    if (filters?.member) params.append('member', filters.member);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get<ApiResponse<{ tasks: Task[] }>>(`/tasks?${params.toString()}`);
    return response.data;
  },

  async getProjectTasks(projectId: string, filters?: TaskFilters): Promise<ApiResponse<{ tasks: Task[] }>> {
    const params = new URLSearchParams();
    if (filters?.member) params.append('member', filters.member);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get<ApiResponse<{ tasks: Task[] }>>(
      `/tasks/project/${projectId}?${params.toString()}`
    );
    return response.data;
  },

  async getTask(taskId: string): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${taskId}`);
    return response.data;
  },

  async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.put<ApiResponse<{ task: Task }>>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/tasks/${taskId}`);
    return response.data;
  },

  async reassignTasks(fromMemberId: string, toMemberId: string, teamId: string): Promise<{
    success: boolean;
    reassignedCount: number;
    tasks: Task[];
  }> {
    // Get all tasks assigned to fromMember in this team
    const tasksResponse = await this.getTasks({ member: fromMemberId });
    const tasksToReassign = tasksResponse.data.tasks.filter((task) => task.team === teamId);

    // Reassign each task
    const reassignedTasks: Task[] = [];
    for (const task of tasksToReassign) {
      try {
        const updatedTaskResponse = await this.updateTask(task.id, {
          assignedMember: toMemberId,
        });
        reassignedTasks.push(updatedTaskResponse.data.task);
      } catch (error) {
        console.error(`Failed to reassign task ${task.id}:`, error);
      }
    }

    return {
      success: true,
      reassignedCount: reassignedTasks.length,
      tasks: reassignedTasks,
    };
  },
};
