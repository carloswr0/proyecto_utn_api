import ServerError from "../helpers/error.helper.js";
import channelService from "../services/channel.service.js";

class ChannelController {
  async createChannel(req, res) {
    try {
      const { name, description } = req.body;
      const workspaceId = req.params.workspace_id;
      if (!name) {
        throw new ServerError({
          status: 400,
          message: "Channel name is required",
          ok: false,
        });
      }
      const channel = await channelService.createChannel({
        name,
        workspaceId,
        createdBy: req.user.id,
        description,
      });
      
      res.status(201).json({
        ok: true,
        status: 201,
        message: "Channel created successfully",
        data: {
          channel
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async getAllChannels(req, res) {
    try {
      const workspaceId = req.params.workspace_id;
      const channels = await channelService.getChannelsByWorkspaceId(workspaceId);
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Channels retrieved successfully",
        data: {
          channels
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async getById(req, res) {
    try {
      const channelId = req.params.channel_id;
      const channel = await channelService.getChannelById(channelId);
      if (!channel) {
        throw new ServerError({
          status: 404,
          message: "Channel not found",
          ok: false,
        });
      }
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Channel retrieved successfully",
        data: {
          channel
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async softDeleteChannel(req, res) {
    try {
      const channelId = req.params.channel_id;
      await channelService.softDeleteChannel(channelId);
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Channel deleted successfully",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async deleteChannel(req, res) {
    try {
      const channelId = req.params.channel_id;
      await channelService.deleteChannel(channelId);
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Channel permanently deleted successfully",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

}

const channelController = new ChannelController();

export default channelController;