import userModel from '../../models/userModel.js';

class UserDAO {
  async findUserByEmail(email) {
    return userModel.findOne({ email }).lean();
  }

  async createUser(userData) {
    const newUser = new userModel(userData);
    return newUser.save();
  }

  async updateUserPassword(email, newPassword) {
    const user = await userModel.findOne({ email });
    if (user) {
      user.password = newPassword;
      await user.save();
    }
    return user;
  }
}

export default UserDAO;