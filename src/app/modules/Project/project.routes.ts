import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { projectControllers } from "./project.controller";
import { projectValidationSchemas } from "./project.validation";

const router = express.Router();

router.get("/", projectControllers.getProjects);

router.post(
  "/",
  // auth(),
  validateRequest(projectValidationSchemas.createProjectSchema),
  projectControllers.createProject,
);

router.get("/:projectId", projectControllers.getProjectById);

router.put(
  "/:projectId",
  auth(),
  validateRequest(projectValidationSchemas.updateProjectSchema),
  projectControllers.updateProject,
);

router.delete("/:projectId", auth(), projectControllers.deleteProject);

export const projectRoutes = router;
