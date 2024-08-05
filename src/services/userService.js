import UserDAO from '../dao/mongoDB/userMongo.js';
import UserDTO from '../dto/userDTO.js';
import CartMongo from '../dao/mongoDB/cartMongo.js';
import bcrypt from 'bcrypt';

const userDAO = new UserDAO();
const cartMongo = new CartMongo();

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
    const newCart = await cartMongo.createCart();
    const newUser = await userDAO.createUser({
      ...userData,
      role,
      cart: newCart._id
    });
    
    return new UserDTO(newUser.toObject());
  }

  async findByPasswordResetToken(token) {
    const user = await userDAO.findUserByResetToken(token);
    return user ? new UserDTO(user) : null;
  }

  async savePasswordResetToken(email, token, expiration) {
    const user = await userDAO.updateUserPasswordResetToken(email, token, expiration);
    return user ? new UserDTO(user) : null;
  }

  async updatePassword(email, newPassword) {
    const user = await userDAO.updateUserPassword(email, newPassword);
    return user ? new UserDTO(user) : null;
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async getUserById(uid) {
    return await userDAO.getUserById(uid);
  }

async updateUser(uid, updateData) {
    return await userDAO.updateUser(uid, updateData);
  }

  async getAllUsers() {
    return await userDAO.getAllUsers();
  }
}

export default UserService;