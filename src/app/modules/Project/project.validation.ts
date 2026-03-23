import { z } from "zod";

// Optional enum example for status
const statusEnum = z.enum(["Completed", "In Progress", "Upcoming"]);

const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Project title is required",
      })
      .min(1, "Project title cannot be empty"),

    description: z
      .string({
        required_error: "Description is required",
      })
      .min(1, "Description cannot be empty"),

    techStack: z.array(z.string()).min(1, {
      message: "Tech stack must include at least one technology",
    }),

    tags: z.array(z.string()).min(1, {
      message: "Tags must include at least one item",
    }),

    features: z.array(z.string()).min(1, {
      message: "Features must include at least one item",
    }),

    issuesFaced: z.array(z.string()).optional(),

    githubFrontend: z.string().url("Must be a valid URL").optional(),
    githubBackend: z.string().url("Must be a valid URL").optional(),
    liveDemo: z.string().url("Must be a valid URL").optional(),

    thumbnail: z.string().url().optional(),

    categoryId: z
      .string({
        required_error: "Category ID is required",
      })
      .min(1, "Category ID cannot be empty"),

    date: z.string().optional(), // use ISO string or convert to Date
    isFeatured: z.boolean().optional(),
    status: statusEnum.optional(), // or z.string() if not using enum
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    techStack: z.array(z.string()).min(1).optional(),
    tags: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    issuesFaced: z.array(z.string()).optional(),
    githubFrontend: z.string().url().optional(),
    githubBackend: z.string().url().optional(),
    liveDemo: z.string().url().optional(),
    details: z.string().min(1).optional(),
    thumbnail: z.string().url().optional(),
    categoryId: z.string().optional(),
    date: z.string().optional(),
    isFeatured: z.boolean().optional(),
    status: statusEnum.optional(), // or z.string()
  }),
});

export const projectValidationSchemas = {
  createProjectSchema,
  updateProjectSchema,
};
