export interface ActivityLog {
  id: string;
  taskId?: string;
  projectId?: string;
  teamId: string;
  message: string;
  timestamp: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityLogData {
  taskId?: string;
  projectId?: string;
  teamId: string;
  message: string;
}

export interface ActivityLogFilters {
  teamId?: string;
  projectId?: string;
  taskId?: string;
  limit?: number;
}

 export * from './activityLog.types';