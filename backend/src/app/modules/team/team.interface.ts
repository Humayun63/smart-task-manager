import { Document, Types } from 'mongoose';

export interface ITeamMember {
    _id: Types.ObjectId;
    name: string;
    role: string;
    capacity: number;
}

export interface ITeam extends Document {
    _id: Types.ObjectId;
    name: string;
    owner: Types.ObjectId;
    members: Types.DocumentArray<ITeamMember>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateTeamRequest {
    name: string;
}

export interface IUpdateTeamRequest {
    name: string;
}

export interface IAddMembersRequest {
    members: Omit<ITeamMember, '_id'>[];
}

export interface IUpdateMemberRequest {
    name?: string;
    role?: string;
    capacity?: number;
}
