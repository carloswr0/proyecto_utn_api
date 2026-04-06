import workspaceMemberRepository from "../repository/workspaceMember.repository.js";

function VerifyWorkspaceRoleMiddleware(req, res, next) {
  try {
    const user = req.user;
    const workspaceId = req.params.workspace_id;
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
    workspaceMemberRepository
      .isMemberPartOfWorkspaceById(user.id, workspaceId)
      .then((isMember) => {
        if (!isMember) {
          return res.status(403).json({
            message:
              "Usuario no pertenece al workspace o no tiene permisos para acceder",
          });
        }
        next();
      })
      .catch((error) => {
        console.error("Erro al chequear membresía del workspace:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default VerifyWorkspaceRoleMiddleware;
