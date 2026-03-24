import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

type TProjectStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "UPCOMING"
  | "ON_HOLD"
  | "ARCHIVED";

type TProjectPayload = {
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

type TNormalizedProjectPayload = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  techStack?: string[];
  tags?: string[];
  keyFeatures?: string[];
  challenges?: string[];
  repoFrontendUrl?: string;
  repoBackendUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  categoryId?: string;
  status?: TProjectStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
};

const parseBooleanFilter = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;

  const v = value.toLowerCase().trim();
  if (v === "true") return true;
  if (v === "false") return false;

  return undefined;
};

const parseDateInput = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return undefined;
};

const normalizeProjectStatus = (value: unknown): TProjectStatus | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;

  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (
    normalized === "COMPLETED" ||
    normalized === "IN_PROGRESS" ||
    normalized === "UPCOMING" ||
    normalized === "ON_HOLD" ||
    normalized === "ARCHIVED"
  ) {
    return normalized;
  }

  return undefined;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const generateUniqueSlug = async (
  value: string,
  excludeId?: string,
): Promise<string> => {
  const baseSlug = slugify(value) || "project";
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const normalizeProjectPayload = (
  payload: Partial<TProjectPayload>,
): TNormalizedProjectPayload => {
  const keyFeatures = payload.keyFeatures ?? payload.features;
  const challenges = payload.challenges ?? payload.issuesFaced;
  const repoFrontendUrl = payload.repoFrontendUrl ?? payload.githubFrontend;
  const repoBackendUrl = payload.repoBackendUrl ?? payload.githubBackend;
  const liveUrl = payload.liveUrl ?? payload.liveDemo ?? payload.demoUrl;
  const startDate =
    parseDateInput(payload.startDate) ??
    parseDateInput(payload.launchedAt) ??
    parseDateInput(payload.date);
  const endDate = parseDateInput(payload.endDate);

  return {
    title: payload.title,
    slug: payload.slug,
    summary: payload.summary,
    description: payload.description,
    techStack: payload.techStack,
    tags: payload.tags,
    keyFeatures,
    challenges,
    repoFrontendUrl,
    repoBackendUrl,
    liveUrl,
    thumbnail: payload.thumbnail,
    gallery: payload.gallery,
    categoryId: payload.categoryId,
    status: normalizeProjectStatus(payload.status),
    isFeatured: payload.isFeatured,
    isPublished: payload.isPublished,
    startDate,
    endDate,
  };
};

const getProjects = async () => {
  return await prisma.project.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: { category: true },
  });
};

const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: { category: true },
  });
};

const getProjectBySlug = async (slug: string) => {
  return prisma.project.findFirst({
    where: { slug },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

const createProject = async (payload: TProjectPayload) => {
  const data = normalizeProjectPayload(payload);

  if (!data.title?.trim()) throw new Error("Title is required");
  if (!data.description?.trim()) throw new Error("Description is required");
  if (!data.categoryId?.trim()) throw new Error("Category ID is required");

  const slugSource = data.slug?.trim() || data.title;
  const slug = await generateUniqueSlug(slugSource);

  const createData: Prisma.ProjectCreateInput = {
    title: data.title.trim(),
    slug,
    summary: data.summary,
    description: data.description.trim(),
    techStack: data.techStack || [],
    tags: data.tags || [],
    keyFeatures: data.keyFeatures || [],
    challenges: data.challenges || [],
    repoFrontendUrl: data.repoFrontendUrl,
    repoBackendUrl: data.repoBackendUrl,
    liveUrl: data.liveUrl,
    thumbnail: data.thumbnail,
    gallery: data.gallery || [],
    status: data.status || "COMPLETED",
    isFeatured: data.isFeatured ?? false,
    isPublished: data.isPublished ?? true,
    startDate: data.startDate,
    endDate: data.endDate,
    category: {
      connect: { id: data.categoryId },
    },
  };

  return prisma.project.create({
    data: createData,
    include: { category: true },
  });
};

const updateProject = async (id: string, payload: Partial<TProjectPayload>) => {
  const data = normalizeProjectPayload(payload);

  const existing = await prisma.project.findUnique({
    where: { id },
    select: { id: true, title: true },
  });

  if (!existing) throw new Error("Project not found");

  const updateData: Prisma.ProjectUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.summary !== undefined) updateData.summary = data.summary;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.techStack !== undefined) updateData.techStack = data.techStack;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.keyFeatures !== undefined) updateData.keyFeatures = data.keyFeatures;
  if (data.challenges !== undefined) updateData.challenges = data.challenges;
  if (data.repoFrontendUrl !== undefined) {
    updateData.repoFrontendUrl = data.repoFrontendUrl;
  }
  if (data.repoBackendUrl !== undefined) {
    updateData.repoBackendUrl = data.repoBackendUrl;
  }
  if (data.liveUrl !== undefined) updateData.liveUrl = data.liveUrl;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.gallery !== undefined) updateData.gallery = data.gallery;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.startDate !== undefined) updateData.startDate = data.startDate;
  if (data.endDate !== undefined) updateData.endDate = data.endDate;

  if (data.slug !== undefined && data.slug.trim()) {
    updateData.slug = await generateUniqueSlug(data.slug, id);
  } else if (data.title && data.title !== existing.title) {
    updateData.slug = await generateUniqueSlug(data.title, id);
  }

  if (data.categoryId) {
    updateData.category = {
      connect: { id: data.categoryId },
    };
  }

  return prisma.project.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });
};

const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};

export const projectServices = {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
