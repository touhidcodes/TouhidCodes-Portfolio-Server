import { ProjectCategory } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

const createProjectCategory = async (categoryData: ProjectCategory) => {
  const result = await prisma.projectCategory.create({
    data: categoryData,
  });
  return result;
};

const getProjectCategories = async () => {
  const result = await prisma.projectCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return result;
};

const deleteProjectCategory = async (categoryId: string) => {
  const result = await prisma.projectCategory.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
};

export const projectCategoryServices = {
  createProjectCategory,
  getProjectCategories,
  deleteProjectCategory,
};
