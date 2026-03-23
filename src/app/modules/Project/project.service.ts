import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

type TProjectPayload = Record<string, unknown> & {
  categoryId?: string;
  keyFeatures?: string[];
  features?: string[];
  challenges?: string[];
  issuesFaced?: string[];
  repoFrontendUrl?: string;
  githubFrontend?: string;
  repoBackendUrl?: string;
  githubBackend?: string;
  demoUrl?: string;
  liveDemo?: string;
};

const parseBooleanFilter = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return undefined;
};

const normalizeProjectPayload = (payload: TProjectPayload): TProjectPayload => {
  const normalized: TProjectPayload = { ...payload };

  if (!normalized.keyFeatures && Array.isArray(normalized.features)) {
    normalized.keyFeatures = normalized.features;
  }

  if (!normalized.challenges && Array.isArray(normalized.issuesFaced)) {
    normalized.challenges = normalized.issuesFaced;
  }

  if (
    !normalized.repoFrontendUrl &&
    typeof normalized.githubFrontend === "string"
  ) {
    normalized.repoFrontendUrl = normalized.githubFrontend;
  }

  if (
    !normalized.repoBackendUrl &&
    typeof normalized.githubBackend === "string"
  ) {
    normalized.repoBackendUrl = normalized.githubBackend;
  }

  if (!normalized.demoUrl && typeof normalized.liveDemo === "string") {
    normalized.demoUrl = normalized.liveDemo;
  }

  delete normalized.features;
  delete normalized.issuesFaced;
  delete normalized.githubFrontend;
  delete normalized.githubBackend;
  delete normalized.liveDemo;

  return normalized;
};

const getProjects = async (
  params: Record<string, unknown>,
  options: TPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, category, featured, published, ...filterData } = params;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  if (typeof searchTerm === "string" && searchTerm.trim().length > 0) {
    const searchText = searchTerm.trim();
    const terms = searchText
      .split(",")
      .map((term) => term.trim())
      .filter(Boolean);

    const searchConditions: Prisma.ProjectWhereInput[] = [
      { title: { contains: searchText, mode: "insensitive" } },
      { summary: { contains: searchText, mode: "insensitive" } },
      { description: { contains: searchText, mode: "insensitive" } },
      ...terms.map(
        (term): Prisma.ProjectWhereInput => ({
          techStack: { has: term },
        }),
      ),
      ...terms.map(
        (term): Prisma.ProjectWhereInput => ({
          tags: { has: term },
        }),
      ),
    ];

    andConditions.push({
      OR: searchConditions,
    });
  }

  if (typeof category === "string" && category.trim().length > 0) {
    andConditions.push({
      category: { name: category.trim() },
    });
  }

  const featuredFilter = parseBooleanFilter(featured);
  if (featuredFilter !== undefined) {
    andConditions.push({
      isFeatured: featuredFilter,
    });
  }

  const publishedFilter = parseBooleanFilter(published);
  if (publishedFilter !== undefined) {
    andConditions.push({
      isPublished: publishedFilter,
    });
  }

  const dynamicFilters = Object.entries(filterData).filter(
    ([, value]) => value !== undefined && value !== "",
  );

  if (dynamicFilters.length > 0) {
    andConditions.push({
      AND: dynamicFilters.map(
        ([key, value]): Prisma.ProjectWhereInput =>
          ({
            [key]: {
              equals: value,
            },
          }) as Prisma.ProjectWhereInput,
      ),
    });
  }

  const whereConditions: Prisma.ProjectWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortableFields = new Set([
    "title",
    "createdAt",
    "updatedAt",
    "sortOrder",
    "launchedAt",
    "status",
  ]);
  const sortBy =
    typeof options.sortBy === "string" && sortableFields.has(options.sortBy)
      ? options.sortBy
      : "sortOrder";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  const result = await prisma.project.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: [
      { isFeatured: "desc" },
      { [sortBy]: sortOrder } as Prisma.ProjectOrderByWithRelationInput,
      { createdAt: "desc" },
    ],
    include: {
      category: true,
    },
  });

  const total = await prisma.project.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getProjectById = async (projectId: string) => {
  const result = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const createProject = async (projectData: TProjectPayload) => {
  const normalizedData = normalizeProjectPayload(projectData);
  const { categoryId, ...data } = normalizedData;

  if (!categoryId || !categoryId.trim()) {
    throw new Error("Category ID is required");
  }

  const result = await prisma.project.create({
    data: {
      ...(data as Prisma.ProjectCreateInput),
      category: {
        connect: { id: categoryId },
      },
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateProject = async (
  projectId: string,
  projectData: Partial<TProjectPayload>,
) => {
  const normalizedData = normalizeProjectPayload(
    projectData as TProjectPayload,
  );
  const { categoryId, ...data } = normalizedData;
  const updateData: Prisma.ProjectUpdateInput = {
    ...(data as Prisma.ProjectUpdateInput),
  };

  if (typeof categoryId === "string" && categoryId.trim().length > 0) {
    updateData.category = {
      connect: { id: categoryId },
    };
  }

  const result = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: updateData,
    include: {
      category: true,
    },
  });
  return result;
};

const deleteProject = async (projectId: string) => {
  const result = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
  return result;
};

export const projectServices = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
