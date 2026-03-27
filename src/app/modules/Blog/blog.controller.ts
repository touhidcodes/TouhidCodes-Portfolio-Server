import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blogServices } from "./blog.service";

const getBlogs = catchAsync(async (req, res) => {


  const result = await blogServices.getBlogs();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully!",
    data: result,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.getBlogById(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
});

const createBlog = catchAsync(async (req, res) => {
  const result = await blogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.updateBlog(blogId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.deleteBlog(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const blogControllers = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
