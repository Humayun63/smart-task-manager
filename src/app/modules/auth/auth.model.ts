import { Schema, model } from 'mongoose';
import { IUser } from './auth.interface';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false, // Password won't be returned in queries by default
        },
        teams: {
            type: [Schema.Types.ObjectId],
            ref: 'Team',
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const User = model<IUser>('User', userSchema);
