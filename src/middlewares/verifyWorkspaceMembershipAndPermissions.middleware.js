import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repository/workspaceMember.repository.js";

function verifyWorkspaceMembershipAndPermissions(valid_roles = []) {
  return async function (req, res, next) {
    try {
      const user = req.user;
      const workspaceId = req.params.workspace_id;
      if (!workspaceId) {
        throw new ServerError({ 
          status: 403,
          message: "Workspace ID is required",
          ok: "false",
        });
      }
      const membership =
        await workspaceMemberRepository.isMemberPartOfWorkspaceById(
          user.id,
          workspaceId,
        );

      if (!membership) {
        throw new ServerError({
          status: 403,
          message:
            "Usuario no pertenece al workspace o no tiene permisos para acceder",
          ok: false,
        });
      }
      const requiresRoleCheck = valid_roles.length > 0;
      const userRoleIsValid = valid_roles.includes(membership.role);
      const noPermission = requiresRoleCheck && !userRoleIsValid;
      if (noPermission) {
        throw new ServerError({
          message: "Rol no tiene permisos suficientes",
          status: 403,
        });
      }
      req.membership = membership;
      next();
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status || 500).json({
          message: error.message,
          status: error.status || 500,
          ok: false,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  };
}

export default verifyWorkspaceMembershipAndPermissions;
