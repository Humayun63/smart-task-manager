export interface TeamMemberSummary {
  memberId: string;
  memberName: string;
  memberRole: string;
  currentTasks: number;
  capacity: number;
  overloaded: boolean;
}

export interface RecentReassignment {
  id: string;
  message: string;
  timestamp: string;
  taskId: any;
  projectId: any;
  createdBy: any;
}

export interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  teamSummary: TeamMemberSummary[];
  recentReassignments: RecentReassignment[];
  filters: {
    teamId: string | null;
    projectId: string | null;
  };
}

export interface DashboardFilters {
  teamId?: string;
  projectId?: string;
}
