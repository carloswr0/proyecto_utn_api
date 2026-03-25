import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    fk_id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fk_id_workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    role: { type: String, enum: ["owner", "admin", "user"], default: "user", required: true },
    created_at: { type: Date, default: Date.now, required: true },
})

// Asociados a la colecccion "members"
const WorkspaceMemberModel = mongoose.model("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMemberModel;