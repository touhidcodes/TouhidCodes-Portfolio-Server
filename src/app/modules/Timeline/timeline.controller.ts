import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { timelineServices } from "./timeline.service";

// Create Timeline
const createTimeline = catchAsync(async (req: Request, res: Response) => {
  const result = await timelineServices.createTimeline(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Timeline created successfully",
    data: result,
  });
});

// Get All Timelines (Grouped)
const getTimelines = catchAsync(async (req: Request, res: Response) => {
  const result = await timelineServices.getTimelines();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Timelines retrieved successfully",
    data: result,
  });
});

// Get Single Timeline
const getSingleTimeline = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await timelineServices.getSingleTimeline(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Timeline retrieved successfully",
    data: result,
  });
});

// Update Timeline
const updateTimeline = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await timelineServices.updateTimeline(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Timeline updated successfully",
    data: result,
  });
});

// Delete Timeline
const deleteTimeline = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await timelineServices.deleteTimeline(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Timeline deleted successfully",
    data: result,
  });
});

export const timelineControllers = {
  createTimeline,
  getTimelines,
  getSingleTimeline,
  updateTimeline,
  deleteTimeline,
};
