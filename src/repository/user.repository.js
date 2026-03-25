import UserModel from "../models/user.model.js";

class UserRepository {
  async create(name, email, password) {
    console.log("Creating user with email:", email);
    await UserModel.create({
      name: name,
      email: email,
      password: password
    });
  };
 
  async deleteById(user_id) {
    await UserModel.findByIdAndDelete(user_id);
  };

  async getById(user_id) {
    return await UserModel.findById(user_id)
  };

  async getOneUserToCheckDBHealth() {
    const user = await UserModel.findOne()
    return user;
  };

  async updateById(user_id, user_new_props) {
    const newUser = UserModel.findByIdAndUpdate(user_id, user_new_props, { returnDocument: 'after' })
    return newUser;
  };

  async getByEmail(email) {
    const user = await UserModel.findOne({email: email})
    return user;
  };

  async getAll() {
    const users = await UserModel.find();
    return users;
  };  
}

const userRepository = new UserRepository()

export default userRepository;