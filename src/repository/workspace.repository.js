import WorkspaceModel from "../models/workspace.model.js";

class WorkspaceRepository {
  async create(title, description, url_image) {
    return await WorkspaceModel.create({
      title: title,
      description: description,
      url_image: url_image,
    });
  };

  async deleteById(user_id) {
    await WorkspaceModel.findByIdAndDelete(user_id);
  };

  async getById(user_id) {
    return await WorkspaceModel.findById(user_id)
  };

  async updateById(user_id, new_workspace_props) {
    const newRepository = WorkspaceModel.findByIdAndUpdate(user_id, new_workspace_props.id, new_workspace_props, { new: true })
    return newRepository;
  };
}

const workspaceRepository = new WorkspaceRepository()

export default workspaceRepository;