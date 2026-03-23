import { BlogCategory } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

const createBlogCategory = async (categoryData: BlogCategory) => {
  const result = await prisma.blogCategory.create({
    data: categoryData,
  });
  return result;
};

const getBlogCategories = async () => {
  const result = await prisma.blogCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return result;
};

const deleteBlogCategory = async (categoryId: string) => {
  const result = await prisma.blogCategory.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
};

export const blogCategoryServices = {
  createBlogCategory,
  getBlogCategories,
  deleteBlogCategory,
};
