import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
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
            minlength: [6, 'Password must be at least 6 characters'],
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

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);
