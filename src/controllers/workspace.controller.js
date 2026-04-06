import workspaceRepository from "../repository/workspace.repository.js";
import workspaceMemberRepository from "../repository/workspaceMember.repository.js";
import ServerError from "../helpers/error.helper.js";

class WorkspaceController {
  async createWorkspace(req, res) {
    try {
      const { title, description, url_image } = req.body;
      const user = req.user._doc || req.user.toObject?.() || req.user;
      if (!user || !user.id) {
        return res.status(401).json({
          message: "Unauthorized: user not authenticated",
          status: 401,
          ok: false,
        });
      }
      const createdWorkspace = await workspaceRepository.create(
        title,
        description,
        url_image,
      );

      await workspaceMemberRepository.create(
        user.id,
        createdWorkspace.id,
        "owner",
      );

      res.status(201).json({
        message: "success",
        status: 201,
        ok: true,
        data: createdWorkspace,
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

  async getWorkspaces(req, res) {
    try {
      const user = req.user._doc || req.user.toObject?.() || req.user;
      const workspaces =
        await workspaceMemberRepository.getWorkspaceListByUserId(user.id);
      res.status(200).json({
        ok: true,
        status: 200,
        message: "success",
        data: workspaces,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWorkspaceDetails(req, res) {
    try {
      const workspaceMembers = await workspaceMemberRepository.getMemberList(
        req.params.workspace_id,
      );
      if (!workspaceMembers) {
        return res.status(404).json({
          message: "Workspace members not found",
          status: 404,
          ok: false,
        });
      }
      const workspaceDetails = await workspaceRepository.getById(
        req.params.workspace_id,
      );
      if (!workspaceDetails) {
        return res.status(404).json({
          message: "Workspace not found",
          status: 404,
          ok: false,
        });
      }
      res.status(200).json({
        ok: true,
        status: 200,
        message: "success",
        data: { workspaceDetails, workspaceMembers },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default WorkspaceController;
