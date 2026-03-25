import { Skill } from "@prisma/client";
import { TGroupedSkills } from "../../interfaces/common";
import { prisma } from "../../lib/prisma";

const getSkills = async () => {
  const result = await prisma.skill.findMany({
    include: {
      skillCategory: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return result;
};

const getGroupedSkills = async () => {
  const result = await prisma.skill.findMany({
    include: {
      skillCategory: true,
    },
    orderBy: [
      {
        skillCategory: {
          name: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
  });

  // Group skills by category name
  const groupedSkills: TGroupedSkills = result.reduce((acc, skill) => {
    const categoryName = skill.skillCategory.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(skill);
    return acc;
  }, {} as TGroupedSkills);

  return groupedSkills;
};

const createSkill = async (skillData: Skill) => {
  const result = await prisma.skill.create({
    data: skillData,
  });
  return result;
};

const updateSkill = async (skillId: string, skillData: Partial<Skill>) => {
  const { skillCategoryId, ...data } = skillData;

  const result = await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: {
      ...data,
      skillCategory: {
        connect: {
          id: skillCategoryId,
        },
      },
    },
  });

  return result;
};

const deleteSkill = async (skillId: string) => {
  const result = await prisma.skill.delete({
    where: {
      id: skillId,
    },
  });
  return result;
};

export const skillServices = {
  getSkills,
  getGroupedSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
