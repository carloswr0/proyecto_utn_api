import express from "express";
import channelController from "../controllers/channel.controller.js";
import verifyWorkspace from "../middlewares/verifyWorkspace.middleware.js"; 
import verifyChannel from "../middlewares/verifyChannel.middleware.js";
import verifyWorkspaceMembershipAndPermissions from "../middlewares/verifyWorkspaceMembershipAndPermissions.middleware.js";

// Create a router for channels, merging params to access workspace_id
const channelRouter = express.Router({ mergeParams: true });

channelRouter.use(verifyWorkspace)
channelRouter.use(verifyWorkspaceMembershipAndPermissions([]));

channelRouter.post("/", channelController.createChannel);
channelRouter.get("/", channelController.getAllChannels);
channelRouter.delete("/:channel_id", verifyChannel, channelController.softDeleteChannel);

export default channelRouter;