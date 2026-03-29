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

  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED";

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
  status?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  launchedAt?: Date | string;
  date?: string;
};
