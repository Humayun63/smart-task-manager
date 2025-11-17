import { Schema, model } from 'mongoose';
import { IActivityLog } from './activityLog.interface';

const activityLogSchema = new Schema<IActivityLog>(
    {
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: [true, 'Team ID is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        timestamp: {
            type: Date,
            required: [true, 'Timestamp is required'],
            default: Date.now,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Created by is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster filtering
activityLogSchema.index({ teamId: 1, timestamp: -1 });
activityLogSchema.index({ projectId: 1, timestamp: -1 });
activityLogSchema.index({ taskId: 1, timestamp: -1 });
activityLogSchema.index({ createdBy: 1 });

export const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema);
