import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    teams?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
}
