import { SkillCategory } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createSkillCategory = async (categoryData: SkillCategory) => {
  const result = await prisma.skillCategory.create({
    data: categoryData,
  });
  return result;
};

const getSkillCategories = async () => {
  const result = await prisma.skillCategory.findMany();
  return result;
};

const deleteSkillCategory = async (categoryId: string) => {
  await prisma.$transaction(async (transaction) => {
    await transaction.skill.deleteMany({
      where: {
        skillCategoryId: categoryId,
      },
    });

    await transaction.skillCategory.delete({
      where: {
        id: categoryId,
      },
    });
  });
};

export const skillCategoryServices = {
  createSkillCategory,
  getSkillCategories,
  deleteSkillCategory,
};
