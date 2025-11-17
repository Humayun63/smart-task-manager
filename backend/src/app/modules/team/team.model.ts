import { Schema, model } from 'mongoose';
import { ITeam, ITeamMember } from './team.interface';

const teamMemberSchema = new Schema<ITeamMember>(
    {
        name: {
            type: String,
            required: [true, 'Member name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Member role is required'],
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, 'Member capacity is required'],
            min: [0, 'Capacity cannot be negative'],
        },
    },
    { _id: true }
);

const teamSchema = new Schema<ITeam>(
    {
        name: {
            type: String,
            required: [true, 'Team name is required'],
            trim: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
        },
        members: {
            type: [teamMemberSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const Team = model<ITeam>('Team', teamSchema);
