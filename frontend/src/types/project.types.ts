export interface Project {
  id: string;
  name: string;
  description: string;
  team: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
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
