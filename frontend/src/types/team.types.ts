export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  capacity: number;
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
}

export interface AddMembersData {
  members: Omit<TeamMember, 'id'>[];
}

export interface UpdateTeamData {
  name?: string;
}

export interface UpdateMemberData {
  name?: string;
  role?: string;
  capacity?: number;
}
