import { Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { TProjectPayload } from "../../types/project";
import { generateUniqueSlug } from "../../utils/slugGenerator";

// GET ALL
const getProjects = async () => {
  return prisma.project.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: { category: true },
  });
};

// GET BY ID
const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: { category: true },
  });
};

// GET BY SLUG
const getProjectBySlug = async (slug: string) => {
  return prisma.project.findFirst({
    where: { slug },
    include: { category: true },
  });
};

// CREATE (NO NORMALIZATION)
const createProject = async (payload: TProjectPayload) => {
  const { categoryId, title, ...rest } = payload;

  if (!title?.trim()) throw new Error("Title is required");
  if (!payload.description?.trim()) throw new Error("Description is required");
  if (!categoryId) throw new Error("Category ID is required");

  const slug = await generateUniqueSlug(title);

  return prisma.project.create({
    data: {
      title,
      slug,

      description: rest.description as string,

      techStack: rest.techStack ?? [],
      tags: rest.tags ?? [],
      keyFeatures: rest.keyFeatures ?? [],
      challenges: rest.challenges ?? [],
      gallery: rest.gallery ?? [],

      status: (rest.status as ProjectStatus) ?? ProjectStatus.COMPLETED,
      isFeatured: rest.isFeatured ?? false,
      isPublished: rest.isPublished ?? true,

      category: {
        connect: { id: categoryId },
      },
    },
    include: { category: true },
  });
};

// UPDATE (ONLY SLUG + DIRECT DATA)
const updateProject = async (
  id: string,
  payload: Partial<Prisma.ProjectCreateInput> & { categoryId?: string },
) => {
  const existing = await prisma.project.findUnique({
    where: { id },
    select: { title: true },
  });

  if (!existing) throw new Error("Project not found");

  const updateData: Prisma.ProjectUpdateInput = {
    ...payload,
  };

  // regenerate slug if title changes
  if (payload.title && payload.title !== existing.title) {
    updateData.slug = await generateUniqueSlug(payload.title, id);
  }

  // category update
  if (payload.categoryId) {
    updateData.category = {
      connect: { id: payload.categoryId },
    };
  }

  return prisma.project.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });
};

// DELETE
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
