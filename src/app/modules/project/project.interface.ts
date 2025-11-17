import { Document, Types } from 'mongoose';

export interface IProject extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    team: Types.ObjectId;
    owner: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateProjectRequest {
    name: string;
    description?: string;
    team: string;
}

export interface IUpdateProjectRequest {
    name?: string;
    description?: string;
    team?: string;
}