import { Schema, model } from 'mongoose';
import { ITask, TaskPriority, TaskStatus } from './task.interface';

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Task description is required'],
            trim: true,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            required: [true, 'Task priority is required'],
            default: TaskPriority.MEDIUM,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            required: [true, 'Task status is required'],
            default: TaskStatus.PENDING,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project is required'],
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: [true, 'Team is required'],
        },
        assignedMember: {
            type: Schema.Types.ObjectId,
            ref: 'Team.members',
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster filtering
taskSchema.index({ project: 1, status: 1, priority: 1 });
taskSchema.index({ owner: 1 });
taskSchema.index({ assignedMember: 1 });

export const Task = model<ITask>('Task', taskSchema);