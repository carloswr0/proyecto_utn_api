import WorkspaceMemberModel from "../models/workspaceMember.model.js";

class WorkspaceMemberRepository {
  async create(fk_id_user, fk_id_workspace, role = "user") {
    await WorkspaceMemberModel.create({
      fk_id_user: fk_id_user,
      fk_id_workspace: fk_id_workspace,
      role: role,
    });
  }

  async updateRole(id_member, role) {
    const newRole = await WorkspaceMemberModel.findByIdAndUpdate(
      id_member,
      { role: role },
      { new: true },
    );
    return newRole;
  }

  async deleteMember(id_member) {
    const user = await WorkspaceMemberModel.findOneAndDelete({
      _id: id_member,
    });
    return user;
  }

  async getMemberList(id_workspace) {
    const members = await WorkspaceMemberModel.find({
      fk_id_workspace: id_workspace,
    })
      .populate("fk_id_user", "name email")
      .populate("fk_id_workspace", "title description");
    const members_mapped = members.map((member) => ({
      member_id: member._id,
      user_id: member.fk_id_user._id,
      user_name: member.fk_id_user.name,
      user_email: member.fk_id_user.email,
      member_role: member.role,
      member_created_at: member.created_at,
      workspace_id: member.fk_id_workspace._id,
      workspace_title: member.fk_id_workspace.title,
      workspace_description: member.fk_id_workspace.description,
    }));
    return members_mapped;
  }

  async getWorkspaceListByUserId(user_id) {
    const members = await WorkspaceMemberModel.find({
      fk_id_user: user_id,
    }).populate("fk_id_workspace");

    const members_mapped = members.map((member) => {
      return {
        member_id: member._id,
        member_role: member.role,
        member_created_at: member.created_at,
        workspace_id: member.fk_id_workspace._id,
        workspace_title: member.fk_id_workspace.title,
        workspace_description: member.fk_id_workspace.description,
      };
    });

    return members_mapped;
  }

  async isMemberPartOfWorkspaceById(user_id, workspace_id) {
    const member = await WorkspaceMemberModel.findOne({
      fk_id_user: user_id,
      fk_id_workspace: workspace_id,
    });
    return member ? true : false;
  }
}

const workspaceMemberRepository = new WorkspaceMemberRepository();

export default workspaceMemberRepository;
