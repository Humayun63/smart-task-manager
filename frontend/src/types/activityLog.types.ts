export interface ActivityLog {
  id: string;
  message: string;
  entity: string;
  entityId: string;
  project?: {
    id: string;
    name: string;
  } | null;
  task?: {
    id: string;
    title: string;
  } | null;
  team?: {
    id: string;
    name: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
}
