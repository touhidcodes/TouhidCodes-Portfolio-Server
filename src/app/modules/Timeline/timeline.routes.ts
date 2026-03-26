import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { timelineControllers } from "./timeline.controller";
import { timelineValidationSchemas } from "./timeline.validation";

const router = Router();

// Create Timeline
router.post(
  "/",
  auth(),
  validateRequest(timelineValidationSchemas.createTimelineSchema),
  timelineControllers.createTimeline,
);

// Get All Timelines (grouped)
router.get("/", timelineControllers.getTimelines);

// Get Single Timeline
router.get("/:id", timelineControllers.getSingleTimeline);

// Update Timeline
router.patch(
  "/:id",
  auth(),
  validateRequest(timelineValidationSchemas.updateTimelineSchema),
  timelineControllers.updateTimeline,
);

// Delete Timeline
router.delete("/:id", auth(), timelineControllers.deleteTimeline);

export const timelineRoutes = router;
