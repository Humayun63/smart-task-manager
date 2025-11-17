import { Document, Types } from 'mongoose';

export interface ITeamMember {
    name: string;
    role: string;
    capacity: number;
}

export interface ITeam extends Document {
    _id: Types.ObjectId;
    name: string;
    owner: Types.ObjectId;
    members: ITeamMember[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateTeamRequest {
    name: string;
}

export interface IAddMembersRequest {
    members: ITeamMember[];
}
