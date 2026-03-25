import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router();

const workspaceController = new WorkspaceController();

workspaceRouter.post("/create", workspaceController.createWorkspace);
workspaceRouter.get("/get-user-workspaces", workspaceController.getWorkspaces);

export default workspaceRouter;
