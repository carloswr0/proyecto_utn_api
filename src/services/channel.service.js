import ServerError from "../helpers/error.helper.js";
import channelRepository from "../repository/channel.repository.js";

class ChannelService {
  async createChannel({ name, workspaceId, description }) {    if (!name || !workspaceId) {
      throw new ServerError({
        status: 400,
        message: "Missing required fields",
        ok: false,
      });
    }

    const channel = await channelRepository.createChannel(
      workspaceId,
      name,
      description,
    );
    return channel;
  }

  async getChannelsByWorkspaceId(workspaceId) {
    if (!workspaceId) {
      throw new ServerError({
        status: 400,
        message: "Workspace ID is required.",
        ok: false,
      });
    }

    const channels = await channelRepository.getAllChannels(workspaceId);
    return channels;
  }

  async getChannelById(channelId) {
    if (!channelId) {
      throw new ServerError({
        status: 400,
        message: "Channel ID is required",
        ok: false,
      });
    }

    const channel = await channelRepository.getChannelById(channelId);
    if (!channel) {
      throw new ServerError({
        status: 404,
        message: "Channel not found",
        ok: false,
      });
    }
    return channel;
  }

  async softDeleteChannel(channelId) {
    if (!channelId) {
      throw new ServerError({
        status: 400,
        message: "Channel ID is required",
        ok: false,
      });
    }

    const channel = await channelRepository.softDeleteChannel(channelId);

    if (!channel) {
      throw new ServerError({
        status: 404,
        message: "Channel not found",
        ok: false,
      });
    }
    return channel;
  }

  async deleteChannel(channelId) {
    if (!channelId) {
      throw new ServerError({
        status: 400,
        message: "Channel ID is required",
        ok: false,
      });
    }

    const channel = await channelRepository.deleteChannel(channelId);
    if (!channel) {
      throw new ServerError({
        status: 404,
        message: "Channel not found",
        ok: false,
      });
    }
    return channel;
  }
}

const channelService = new ChannelService();

export default channelService;
