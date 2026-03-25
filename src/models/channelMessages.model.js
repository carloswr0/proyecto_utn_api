import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema({
    fk_id_channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    fk_id_member: { type: mongoose.Schema.Types.ObjectId, ref: "WorkspaceMember", required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },
})

// Asociados a la colecccion "ChannelMessages"
const ChannelMessagesModel = mongoose.model("ChannelMessages", channelMessagesSchema);

export default ChannelMessagesModel;
