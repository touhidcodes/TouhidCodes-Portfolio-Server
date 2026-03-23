import { Prisma, Project } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

const getProjects = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, category, featured, ...filterData } = params;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        {
          techStack: {
            hasSome: searchTerm.split(",").map((term: string) => ({
              contains: term.trim(),
              mode: "insensitive",
            })),
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: { name: category },
    });
  }

  if (featured) {
    andConditions.push({
      isFeatured: true,
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProjectWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.project.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
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

const getProjectById = async (projectId: string): Promise<Project | null> => {
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

const createProject = async (projectData: Project) => {
  const { categoryId, ...data } = projectData;
  const result = await prisma.project.create({
    data: {
      ...data,
      category: {
        connect: { id: categoryId },
      },
    },
  });
  return result;
};

const updateProject = async (
  projectId: string,
  projectData: Partial<Project>
) => {
  const { categoryId, ...data } = projectData;
  const result = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...data,
      category: {
        connect: { id: categoryId },
      },
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
