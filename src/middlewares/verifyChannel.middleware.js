import { isValidObjectId } from "mongoose";
import channelRepository from "../repository/channel.repository.js";
import ServerError from "../helpers/error.helper.js";

async function verifyChannel(req, res, next) {
  const channelId = req.params.channel_id;
  const workspaceId = req.workspace.id;

  if (!channelId) {
    return res.status(400).json({
      message: "Channel ID is required",
      status: 400,
      ok: false,
    });
  }

  if (!isValidObjectId(channelId)) {
    return res.status(400).json({
      message: "Invalid Channel ID format",
      status: 400,
      ok: false,
    });
  }

  try {
    const channel = await channelRepository.getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
        status: 404,
        ok: false,
      });
    }
   
    if (!channel.channel_workspace_id.equals(workspaceId)) {
      return res.status(403).json({
        message: "Channel does not belong to the current workspace",
        status: 403,
        ok: false,
      });
    }

    req.channel = channel;
    next();
  } catch (error) {
    if (error instanceof ServerError) {
      return res.status(error.status).json({
        message: error.message,
        status: error.status,
        ok: false,
      });
    }
  }
}

export default verifyChannel;
