import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { projectServices } from "./project.service";

const getProjects = catchAsync(async (req, res) => {
  const result = await projectServices.getProjects();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully!",
    data: result,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await projectServices.getProjectById(projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully!",
    data: result,
  });
});

const createProject = catchAsync(async (req, res) => {
  const result = await projectServices.createProject(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully!",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await projectServices.updateProject(projectId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully!",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await projectServices.deleteProject(projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully!",
    data: result,
  });
});

export const projectControllers = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
