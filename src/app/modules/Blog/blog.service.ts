import { Blog } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const getBlogs = async () => {
  const result = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return {
    data: result,
  };
};

const getBlogById = async (blogId: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const createBlog = async (blogData: Blog) => {
  const { categoryId, ...data } = blogData;
  const result = await prisma.blog.create({
    data: {
      ...data,
      category: {
        connect: { id: categoryId },
      },
    },
  });
  return result;
};

const updateBlog = async (blogId: string, blogData: Partial<Blog>) => {
  const { categoryId, ...data } = blogData;
  const result = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      ...data,
      category: {
        connect: { id: categoryId },
      },
    },
  });
  return result;
};

const deleteBlog = async (blogId: string) => {
  const result = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });
  return result;
};

export const blogServices = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
