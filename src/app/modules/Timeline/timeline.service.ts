import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

// 🔹 Create Timeline Entry
const createTimeline = async (payload: Prisma.TimelineCreateInput) => {
  const result = await prisma.timeline.create({
    data: payload,
  });
  return result;
};

// 🔹 Get All Timeline Entries (with optional filters)
const getTimelines = async (params?: {
  type?: "experience" | "education" | "certification";
  isFeatured?: boolean;
}) => {
  const { type, isFeatured } = params || {};

  const result = await prisma.timeline.findMany({
    where: {
      ...(type && { type }),
      ...(isFeatured !== undefined && { isFeatured }),
    },
    orderBy: [
      { isFeatured: "desc" }, // featured first
      { startDate: "desc" }, // latest first
      { createdAt: "desc" },
    ],
  });

  return result;
};

// 🔹 Get Single Timeline
const getSingleTimeline = async (id: string) => {
  const result = await prisma.timeline.findUnique({
    where: { id },
  });
  return result;
};

// 🔹 Update Timeline
const updateTimeline = async (
  id: string,
  payload: Prisma.TimelineUpdateInput,
) => {
  const result = await prisma.timeline.update({
    where: { id },
    data: payload,
  });
  return result;
};

// 🔹 Delete Timeline
const deleteTimeline = async (id: string) => {
  const result = await prisma.timeline.delete({
    where: { id },
  });
  return result;
};

// 🔹 Get Grouped Timeline (for UI sections)
const getGroupedTimelines = async () => {
  const result = await prisma.timeline.findMany({
    orderBy: [{ startDate: "desc" }],
  });

  return {
    experience: result.filter((item) => item.type === "experience"),
    education: result.filter((item) => item.type === "education"),
    certification: result.filter((item) => item.type === "certification"),
  };
};

export const timelineServices = {
  createTimeline,
  getTimelines,
  getSingleTimeline,
  updateTimeline,
  deleteTimeline,
  getGroupedTimelines,
};
