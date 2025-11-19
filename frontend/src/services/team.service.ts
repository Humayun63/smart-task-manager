import api from './api';
import type {
  Team,
  CreateTeamData,
  AddMembersData,
  UpdateTeamData,
  UpdateMemberData,
  ApiResponse,
} from '../types';

// Transform backend _id to frontend id
const transformTeam = (team: any): Team => ({
  ...team,
  id: team._id ||team.id,
  members: team.members.map((member: any) => ({
    ...member,
    id: member._id || member.id,
  })),
});

const transformTeams = (teams: any[]): Team[] => teams.map(transformTeam);

export const teamService = {
  async createTeam(data: CreateTeamData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.post('/teams', data);
    return {
      ...response.data,
      data: {
        team: transformTeam(response.data.data.team)
      },
    };
  },

  async getTeams(): Promise<ApiResponse<{ teams: Team[] }>> {
    const response = await api.get('/teams');
    return {
      ...response.data,
      data: {
        teams: transformTeams(response.data.data.teams),
      },
    };
  },

  async getTeam(teamId: string): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.get(`/teams/${teamId}`);
    return {
      ...response.data,
      data: {
        team: transformTeam(response.data.data.team),
      },
    };
  },

  async updateTeam(teamId: string, data: UpdateTeamData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.put(`/teams/${teamId}`, data);
    return {
      ...response.data,
      data: {
        team: response.data.data.team,
      },
    };
  },

  async deleteTeam(teamId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/teams/${teamId}`);
    return response.data;
  },

  async addMembers(teamId: string, data: AddMembersData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.post(`/teams/${teamId}/members`, data);
    return {
      ...response.data,
      data: {
        team: response.data.data.team,
      },
    };
  },

  async getMembers(teamId: string): Promise<ApiResponse<{ members: Team['members'] }>> {
    const response = await api.get(`/teams/${teamId}/members`);
    return {
      ...response.data,
      data: {
        members: response.data.data.members,
      },
    };
  },

  async updateMember(
    teamId: string,
    memberId: string,
    data: UpdateMemberData
  ): Promise<ApiResponse<{ member: Team['members'][0] }>> {
    const response = await api.put(
      `/teams/${teamId}/members/${memberId}`,
      data
    );
    return response.data;
  },

  async deleteMember(teamId: string, memberId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/teams/${teamId}/members/${memberId}`);
    return response.data;
  },
};
