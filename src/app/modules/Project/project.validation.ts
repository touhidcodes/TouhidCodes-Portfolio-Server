import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

// Mongo ObjectId validator
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid Mongo ObjectId");

export const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3)
      .max(100),

    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(10),

    summary: z.string().trim().max(200).optional(),

    categoryId: objectId,

    // Arrays
    techStack: z.array(z.string().trim()).optional(),
    tags: z.array(z.string().trim()).optional(),

    keyFeatures: z
      .array(z.string().trim())
      .min(1, "At least one key feature is required"),

    challenges: z
      .array(z.string().trim())
      .min(1, "At least one challenge is required"),

    gallery: z.array(z.string().url()).optional(),

    // URLs
    repoFrontendUrl: z.string().url().optional(),
    repoBackendUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    thumbnail: z.string().url().optional(),

    // Enum
    status: z.nativeEnum(ProjectStatus).optional(),

    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),

    // Dates (string → Date handled later in service)
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().min(10).optional(),
    summary: z.string().trim().max(200).optional(),

    categoryId: objectId.optional(),

    techStack: z.array(z.string().trim()).optional(),
    tags: z.array(z.string().trim()).optional(),
    keyFeatures: z.array(z.string().trim()).optional(),
    challenges: z.array(z.string().trim()).optional(),
    gallery: z.array(z.string().url()).optional(),

    repoFrontendUrl: z.string().url().optional(),
    repoBackendUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    thumbnail: z.string().url().optional(),

    status: z.nativeEnum(ProjectStatus).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),

    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const projectValidationSchemas = {
  createProjectSchema,
  updateProjectSchema,
};
