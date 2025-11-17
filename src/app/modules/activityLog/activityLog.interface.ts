import { Document, Types } from 'mongoose';

export interface IActivityLog extends Document {
    _id: Types.ObjectId;
    taskId?: Types.ObjectId;
    projectId?: Types.ObjectId;
    teamId: Types.ObjectId;
    message: string;
    timestamp: Date;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateActivityLogInput {
    taskId?: string;
    projectId?: string;
    teamId: string;
    message: string;
}

export interface GetActivityLogFilters {
    teamId?: string;
    projectId?: string;
    taskId?: string;
    limit?: number;
}