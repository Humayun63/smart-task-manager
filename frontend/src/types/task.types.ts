export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export interface TaskAssignedMember {
  id: string;
  name: string;
  role: string;
  capacity: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  project: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
  };
  assignedMember: TaskAssignedMember | null;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  project: string;
  assignedMember?: string;
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
