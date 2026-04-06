import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import VerifyWorkspaceRoleMiddleware from "../middlewares/VerifyWorkspaceRoleMiddleware.js";

const workspaceRouter = express.Router();

const workspaceController = new WorkspaceController();

workspaceRouter.post("/", workspaceController.createWorkspace);
workspaceRouter.get("/get-user-workspaces", workspaceController.getWorkspaces);
workspaceRouter.get(
  "/:workspace_id",
  VerifyWorkspaceRoleMiddleware,
  workspaceController.getWorkspaceDetails,
);
export default workspaceRouter;
