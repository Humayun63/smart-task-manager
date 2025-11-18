import api from './api';
import type {
  Team,
  CreateTeamData,
  AddMembersData,
  UpdateTeamData,
  UpdateMemberData,
  ApiResponse,
} from '../types';

export const teamService = {
  async createTeam(data: CreateTeamData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.post<ApiResponse<{ team: Team }>>('/teams', data);
    return response.data;
  },

  async getTeams(): Promise<ApiResponse<{ teams: Team[] }>> {
    const response = await api.get<ApiResponse<{ teams: Team[] }>>('/teams');
    return response.data;
  },

  async getTeam(teamId: string): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.get<ApiResponse<{ team: Team }>>(`/teams/${teamId}`);
    return response.data;
  },

  async updateTeam(teamId: string, data: UpdateTeamData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.put<ApiResponse<{ team: Team }>>(`/teams/${teamId}`, data);
    return response.data;
  },

  async deleteTeam(teamId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/teams/${teamId}`);
    return response.data;
  },

  async addMembers(teamId: string, data: AddMembersData): Promise<ApiResponse<{ team: Team }>> {
    const response = await api.post<ApiResponse<{ team: Team }>>(`/teams/${teamId}/members`, data);
    return response.data;
  },

  async getMembers(teamId: string): Promise<ApiResponse<{ members: Team['members'] }>> {
    const response = await api.get<ApiResponse<{ members: Team['members'] }>>(`/teams/${teamId}/members`);
    return response.data;
  },

  async updateMember(
    teamId: string,
    memberId: string,
    data: UpdateMemberData
  ): Promise<ApiResponse<{ member: Team['members'][0] }>> {
    const response = await api.put<ApiResponse<{ member: Team['members'][0] }>>(
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
