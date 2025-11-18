export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  project: string;
  team: string;
  assignedMember: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  project: string;
  assignedMember: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedMember?: string;
}

export interface TaskFilters {
  project?: string;
  member?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
