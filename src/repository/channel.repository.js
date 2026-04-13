import ChannelModel from "../models/channel.model.js";
import ChannelDTO from "../DTO/channel.dto.js";

class ChannelRepository {
  async createChannel(workspaceId, name, description) {
    const newChannel = await ChannelModel.create({
      fk_id_workspace: workspaceId,
      name,
      description,
    });
    const normalized_channel = new ChannelDTO(newChannel);
    return normalized_channel;
  }

  async getAllChannels(workspace_id) {
    const channels = await ChannelModel.find({
      fk_id_workspace: workspace_id,
      isActive: true,
    });
    return channels.map((channel) => new ChannelDTO(channel));
  }

  async getChannelById(id) {
    const channel = await ChannelModel.findById(id);
    if (!channel) return null;
    return new ChannelDTO(channel);
  }

  async getChannelByIdAndWorkspaceId(channel_id, workspace_id) {
    const channel = await ChannelModel.findOne({
      where: {
        id: channel_id,
        fk_id_workspace: workspace_id,
      },
    });
    if (!channel) return null;
    return new ChannelDTO(channel);
  }

  async softDeleteChannel(channel_id) {
    const channel = await ChannelModel.findOneAndUpdate(
      { _id: channel_id, isActive: true },
      { isActive: false },
      {
        new: true,
      },
    );
    if (!channel) return null;
    return new ChannelDTO(channel);
  }

  async deleteChannel(channel_id) {
    const channel = await ChannelModel.findByIdAndDelete(channel_id, {
      returnDocument: "after",
    });
    if (!channel) return null;
    return new ChannelDTO(channel);
  }
}

const channelRepository = new ChannelRepository();

export default channelRepository;
