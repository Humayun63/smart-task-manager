export interface Project {
  _id: string;
  name: string;
  description: string;
  team: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  team: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  team?: string;
}
