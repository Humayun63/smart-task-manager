import { Types } from 'mongoose';

export interface ITeamMemberSummary {
    memberId: Types.ObjectId;
    memberName: string;
    memberRole: string;
    currentTasks: number;
    capacity: number;
    overloaded: boolean;
}

export interface IRecentReassignment {
    id: Types.ObjectId;
    message: string;
    timestamp: Date;
    taskId?: any;
    projectId?: any;
    createdBy?: any;
}

export interface IDashboardResponse {
    totalProjects: number;
    totalTasks: number;
    teamSummary: ITeamMemberSummary[];
    recentReassignments: IRecentReassignment[];
}

export interface IDashboardFilters {
    teamId?: string;
    projectId?: string;
}