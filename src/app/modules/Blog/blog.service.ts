import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

const getBlogs = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, category, published, ...filterData } = params;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: { name: category },
    });
  }

  if (published !== undefined) {
    andConditions.push({
      published: published,
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
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
