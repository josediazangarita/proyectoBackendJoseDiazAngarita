import UserDAO from '../dao/mongoDB/userMongo.js';
import UserDTO from '../dto/userDTO.js';

const userDAO = new UserDAO();
class UserService {
  async getUserByEmail(email) {
    const user = await userDAO.findUserByEmail(email);
    if (!user) return null;
    return new UserDTO(user);
  }

  async createUser(userData) {
    const newUser = await userDAO.createUser(userData);
    return new UserDTO(newUser.toObject());
  }

  async updateUserPassword(email, newPassword) {
    const user = await userDAO.updateUserPassword(email, newPassword);
    if (!user) return null;
    return new UserDTO(user.toObject());
  }
}

export default UserService;