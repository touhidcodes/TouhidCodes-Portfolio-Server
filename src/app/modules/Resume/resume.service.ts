import { Resume } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createOrUpdateResume = async (resumeData: Resume) => {
  await prisma.resume.deleteMany({});

  const result = await prisma.resume.create({
    data: resumeData,
  });

  return result;
};

const getResumeUrl = async () => {
  const resume = await prisma.resume.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return resume ? resume : null;
};

export const resumeServices = { createOrUpdateResume, getResumeUrl };
