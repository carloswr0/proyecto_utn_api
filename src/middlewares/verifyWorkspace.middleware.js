import { isValidObjectId } from "mongoose";
import workspaceRepository from "../repository/workspace.repository.js";
import ServerError from "../helpers/error.helper.js";

async function verifyWorkspace(req, res, next) {
  const workspaceId = req.params.workspace_id;

  if (!workspaceId) {
    return res.status(400).json({
      message: "Workspace ID is required",
      status: 400,
      ok: false,
    });
  }

  if (!isValidObjectId(workspaceId)) {
    return res.status(400).json({
      message: "Invalid Workspace ID format",
      status: 400,
      ok: false,
    });
  }

  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        status: 404,
        ok: false,
      });
    }
    req.workspace = workspace;
    next();
  } catch (error) {
    if (error instanceof ServerError) {
      return res.status(error.status).json({
        message: error.message,
        status: error.status,
        ok: false,
      });
    }
  }
}

export default verifyWorkspace;
