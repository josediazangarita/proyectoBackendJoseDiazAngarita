import UserDAO from '../dao/mongoDB/userMongo.js';
import UserDTO from '../dto/userDTO.js';
import CartMongo from '../dao/mongoDB/cartMongo.js';

const userDAO = new UserDAO();
const cartMongo = new CartMongo;
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

  async updateUserPassword(email, newPassword) {
    const user = await userDAO.updateUserPassword(email, newPassword);
    if (!user) return null;
    return new UserDTO(user.toObject());
  }
}

export default UserService;