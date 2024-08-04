import userModel from '../../models/userModel.js';

class UserDAO {
  
  async findUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async createUser(userData) {
    const newUser = new userModel(userData);
    return await newUser.save();
  }

  async findUserByResetToken(token) {
    return await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  }

  async updateUserPasswordResetToken(email, token, expiration) {
    return await userModel.findOneAndUpdate(
      { email },
      { resetPasswordToken: token, resetPasswordExpires: expiration },
      { new: true }
    );
  }

  async updateUserPassword(email, newPassword) {
    const user = await userModel.findOne({ email });
    if (user) {
      user.password = newPassword;
      await user.save();
    }
    return user;
  }

  async getUserById(uid) {
    return await userModel.findById(uid).lean();
  }

async updateUser(uid, updateData) {
    return await userModel.findByIdAndUpdate(uid, updateData, { new: true }).lean();
  }
}

export default UserDAO;