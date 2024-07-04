import UserDAO from '../dao/mongoDB/userMongo.js';
import UserDTO from '../dto/userDTO.js';

const userDAO = new UserDAO();
class UserService {

  determineUserRole(email) {
    return email.endsWith('@coder.com') ? 'admin' : 'user';
  }

  async getUserByEmail(email) {
    const user = await userDAO.findUserByEmail(email);
    if (!user) return null;
    return new UserDTO(user);
  }

  async createUser(userData) {
    const role = this.determineUserRole(userData.email);
    const newUser = await userDAO.createUser({
      ...userData,
      role
    });
    
    return new UserDTO(newUser.toObject());
  }

  async updateUserPassword(email, newPassword) {
    const user = await userDAO.updateUserPassword(email, newPassword);
    if (!user) return null;
    return new UserDTO(user.toObject());
  }
}

export default UserService;