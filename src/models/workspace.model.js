import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, },
    created_at: { type: Date, default: Date.now, required: true },
    active: { type: Boolean, default: false, required: true },
    url_image: { type: String, required: true },
})

// Asociados a la colecccion "workspaces"
const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);

export default WorkspaceModel;