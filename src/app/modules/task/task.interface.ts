import { Document, Types } from 'mongoose';

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export enum TaskStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export interface ITask extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    project: Types.ObjectId;
    team: Types.ObjectId;
    assignedMember?: Types.ObjectId;
    owner: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateTaskRequest {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
    project: string;
    assignedMember?: string;
}

export interface IUpdateTaskRequest {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    assignedMember?: string;
}

export interface ITaskFilters {
    project?: string;
    member?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
}