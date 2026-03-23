import { z } from "zod";

const projectStatusEnum = z.enum([
  "Completed",
  "In Progress",
  "Upcoming",
  "On Hold",
  "Archived",
]);

const projectRoleEnum = z.enum([
  "FULL_STACK",
  "FRONTEND",
  "BACKEND",
  "UI_UX",
  "DEVOPS",
  "MOBILE",
]);

const nonEmptyStringArray = z
  .array(z.string().trim().min(1, "Array values cannot be empty"))
  .min(1);

const optionalStringArray = z.array(z.string().trim().min(1)).optional();
const optionalUrl = z.string().url("Must be a valid URL").optional();

const projectCreateBodySchema = z
  .object({
    title: z
      .string({
        required_error: "Project title is required",
      })
      .trim()
      .min(1, "Project title cannot be empty"),

    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain lowercase letters, numbers, and hyphens only",
      })
      .optional(),

    summary: z.string().trim().min(1).optional(),

    description: z
      .string({
        required_error: "Description is required",
      })
      .trim()
      .min(1, "Description cannot be empty"),

    techStack: nonEmptyStringArray,
    tags: optionalStringArray,

    keyFeatures: optionalStringArray,
    features: optionalStringArray, // Legacy alias

    challenges: optionalStringArray,
    issuesFaced: optionalStringArray, // Legacy alias

    impactMetrics: optionalStringArray,
    learnings: optionalStringArray,

    repoFrontendUrl: optionalUrl,
    repoBackendUrl: optionalUrl,
    demoUrl: optionalUrl,
    caseStudyUrl: optionalUrl,
    videoDemoUrl: optionalUrl,

    githubFrontend: optionalUrl, // Legacy alias
    githubBackend: optionalUrl, // Legacy alias
    liveDemo: optionalUrl, // Legacy alias

    thumbnail: optionalUrl,
    gallery: optionalStringArray,

    role: projectRoleEnum.optional(),
    teamSize: z.number().int().positive().optional(),

    categoryId: z
      .string({
        required_error: "Category ID is required",
      })
      .min(1, "Category ID cannot be empty"),

    launchedAt: z.coerce.date().optional(),
    date: z.string().trim().optional(), // legacy

    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional(),
    status: projectStatusEnum.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.keyFeatures?.length && !data.features?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["keyFeatures"],
        message: "At least one key feature is required",
      });
    }
  });

const createProjectSchema = z.object({
  body: projectCreateBodySchema,
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain lowercase letters, numbers, and hyphens only",
      })
      .optional(),
    summary: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    techStack: nonEmptyStringArray.optional(),
    tags: optionalStringArray,
    keyFeatures: optionalStringArray,
    features: optionalStringArray, // Legacy alias
    challenges: optionalStringArray,
    issuesFaced: optionalStringArray, // Legacy alias
    impactMetrics: optionalStringArray,
    learnings: optionalStringArray,
    repoFrontendUrl: optionalUrl,
    repoBackendUrl: optionalUrl,
    demoUrl: optionalUrl,
    caseStudyUrl: optionalUrl,
    videoDemoUrl: optionalUrl,
    githubFrontend: optionalUrl, // Legacy alias
    githubBackend: optionalUrl, // Legacy alias
    liveDemo: optionalUrl, // Legacy alias
    thumbnail: optionalUrl,
    gallery: optionalStringArray,
    role: projectRoleEnum.optional(),
    teamSize: z.number().int().positive().optional(),
    categoryId: z.string().optional(),
    launchedAt: z.coerce.date().optional(),
    date: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional(),
    status: projectStatusEnum.optional(),
  }),
});

export const projectValidationSchemas = {
  createProjectSchema,
  updateProjectSchema,
};
