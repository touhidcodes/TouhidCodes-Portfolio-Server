import { z } from "zod";

// Base Timeline Schema
const baseTimelineSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1),
  organization: z.string({ required_error: "Organization is required" }).min(1),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),

  location: z.string().optional(),
  description: z.string().optional(),

  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),

  isFeatured: z.boolean().optional(),
});

// Experience Schema
const experienceSchema = baseTimelineSchema.extend({
  type: z.literal("experience"),

  employmentType: z
    .enum(["full-time", "part-time", "internship", "freelance", "contract"])
    .optional(),

  companyType: z.enum(["startup", "agency", "product", "research"]).optional(),

  responsibilities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

// Education Schema
const educationSchema = baseTimelineSchema.extend({
  type: z.literal("education"),

  degree: z.string({ required_error: "Degree is required" }).min(1),
  fieldOfStudy: z
    .string({ required_error: "Field of study is required" })
    .min(1),

  grade: z.string().optional(),

  resultType: z.enum(["CGPA", "GPA", "Percentage"]).optional(),

  activities: z.array(z.string()).optional(),

  institutionType: z.enum(["school", "college", "university"]).optional(),
});

// Certification Schema
const certificationSchema = baseTimelineSchema.extend({
  type: z.literal("certification"),

  issuer: z.string({ required_error: "Issuer is required" }).min(1),

  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),

  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),

  learningType: z
    .enum(["course", "bootcamp", "workshop", "training"])
    .optional(),
});

// Discriminated Union (Core)
const createTimelineBodySchema = z.discriminatedUnion("type", [
  experienceSchema,
  educationSchema,
  certificationSchema,
]);

/**
 * 🔹 Create Schema
 */
const createTimelineSchema = z.object({
  body: createTimelineBodySchema,
});

// Update Schema (Partial but still type-safe)
const updateTimelineBodySchema = z.discriminatedUnion("type", [
  experienceSchema
    .extend({
      type: z.literal("experience"),
    })
    .partial()
    .required({ type: true }),

  educationSchema
    .extend({
      type: z.literal("education"),
    })
    .partial()
    .required({ type: true }),

  certificationSchema
    .extend({
      type: z.literal("certification"),
    })
    .partial()
    .required({ type: true }),
]);

const updateTimelineSchema = z.object({
  body: updateTimelineBodySchema,
});

export const timelineValidationSchemas = {
  createTimelineSchema,
  updateTimelineSchema,
};
