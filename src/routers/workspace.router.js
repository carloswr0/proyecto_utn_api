import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import channelRouter from "./channel.router.js";
import verifyWorkspaceMembershipAndPermissions from "../middlewares/verifyWorkspaceMembershipAndPermissions.middleware.js";

const workspaceRouter = express.Router();
const workspaceController = new WorkspaceController();

workspaceRouter.use(authMiddleware);

workspaceRouter.post("/", workspaceController.createWorkspace);
workspaceRouter.get("/get-user-workspaces", workspaceController.getWorkspaces);
workspaceRouter.get("/:workspace_id", verifyWorkspaceMembershipAndPermissions([]), workspaceController.getWorkspaceDetails);
workspaceRouter.use("/:workspace_id/channel", channelRouter);

export default workspaceRouter;
