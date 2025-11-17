import { Schema, model } from 'mongoose';
import { IProject } from './project.interface';

const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: [true, 'Team is required'],
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

export const Project = model<IProject>('Project', projectSchema);