import workspaceRepository from "../repository/workspace.repository.js";
import workspaceMemberRepository from "../repository/workspaceMember.repository.js";

class WorkspaceController {
  async createWorkspace(req, res) {
    try {
      const { title, description, url_image } = req.body;
      const user = req.user._doc || req.user.toObject?.() || req.user;

      if (!user || !user._id) {
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
        user._id,
        createdWorkspace._id,
        "owner",
      );

      res.status(201).json(createdWorkspace);
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
      console.log(user);
      const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(
        user.id,
      );
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
}

export default WorkspaceController;
