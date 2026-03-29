export interface TProject {
  id: string;

  title: string;
  slug?: string;

  summary?: string;
  description: string;

  techStack: string[];
  tags: string[];

  keyFeatures: string[];
  challenges: string[];

  repoFrontendUrl?: string;
  repoBackendUrl?: string;
  liveUrl?: string;

  thumbnail: string;
  gallery?: string[];

  status: ProjectStatus;

  isFeatured?: boolean;
  isPublished?: boolean;

  startDate?: string;
  endDate?: string;

  categoryId: string;

  createdAt?: string;
  updatedAt?: string;
}

export type TProjectPayload = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  techStack?: string[];
  tags?: string[];
  keyFeatures?: string[];
  features?: string[];
  challenges?: string[];
  issuesFaced?: string[];
  repoFrontendUrl?: string;
  repoBackendUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  githubFrontend?: string;
  githubBackend?: string;
  liveDemo?: string;
  thumbnail?: string;
  gallery?: string[];
  categoryId?: string;
  status?: ProjectStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  launchedAt?: Date | string;
  date?: string;
};

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  techStack?: string[];
  tags?: string[];
  keyFeatures?: string[];
  challenges?: string[];
  gallery?: string[];

  repoFrontendUrl?: string;
  repoBackendUrl?: string;
  liveUrl?: string;

  thumbnail?: string;

  status?: ProjectStatus;
  isFeatured?: boolean;
  isPublished?: boolean;

  startDate?: Date | string;
  endDate?: Date | string;

  categoryId?: string;
}

export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}