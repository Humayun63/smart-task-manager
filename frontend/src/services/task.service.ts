import api from './api';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  ApiResponse,
} from '../types';

// Transform backend _id to frontend id
const transformTask = (task: any): Task => ({
  ...task,
  id: task.id || task._id,
  project: {
    id: task.project._id || task.project.id,
    name: task.project.name,
  },
  team: {
    id: task.team._id || task.team.id,
    name: task.team.name,
  },
  assignedMember: task.assignedMember ? {
    id: task.assignedMember.id || task.assignedMember._id,
    name: task.assignedMember.name,
    role: task.assignedMember.role,
    capacity: task.assignedMember.capacity,
  } : null,
  owner: {
    id: task.owner._id || task.owner.id,
    name: task.owner.name,
    email: task.owner.email,
  },
});

const transformTasks = (tasks: any[]): Task[] => tasks.map(transformTask);

export const taskService = {
  async createTask(data: CreateTaskData): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.post('/tasks', data);
    return {
      ...response.data,
      data: {
        task: transformTask(response.data.data.task),
      },
    };
  },

  async getTasks(filters?: TaskFilters): Promise<ApiResponse<{ tasks: Task[] }>> {
    const params = new URLSearchParams();
    if (filters?.project) params.append('project', filters.project);
    if (filters?.member) params.append('member', filters.member);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get(`/tasks?${params.toString()}`);
    return {
      ...response.data,
      data: {
        tasks: transformTasks(response.data.data.tasks),
      },
    };
  },

  async getProjectTasks(projectId: string, filters?: TaskFilters): Promise<ApiResponse<{ tasks: Task[] }>> {
    const params = new URLSearchParams();
    if (filters?.member) params.append('member', filters.member);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get(
      `/tasks/project/${projectId}?${params.toString()}`
    );
    return {
      ...response.data,
      data: {
        tasks: transformTasks(response.data.data.tasks),
      },
    };
  },

  async getTask(taskId: string): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.get(`/tasks/${taskId}`);
    return {
      ...response.data,
      data: {
        task: transformTask(response.data.data.task),
      },
    };
  },

  async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiResponse<{ task: Task }>> {
    const response = await api.put(`/tasks/${taskId}`, data);
    return {
      ...response.data,
      data: {
        task: transformTask(response.data.data.task),
      },
    };
  },

  async deleteTask(taskId: string): Promise<ApiResponse> {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  async autoReassignTasks(teamId: string, projectId?: string): Promise<ApiResponse<{
    reassignedCount: number;
    reassignments: Array<{
      taskId: string;
      taskTitle: string;
      fromMember: string;
      toMember: string;
    }>;
  }>> {
    const response = await api.post('/tasks/auto-reassign', {
      teamId,
      projectId,
    });
    return response.data;
  },

  async reassignTasks(fromMemberId: string, toMemberId: string, teamId: string): Promise<{
    success: boolean;
    reassignedCount: number;
    tasks: Task[];
  }> {
    // Get all tasks assigned to fromMember in this team
    const tasksResponse = await this.getTasks({ member: fromMemberId });
    const tasksToReassign = tasksResponse.data.tasks.filter((task) => task.team.id === teamId);

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
