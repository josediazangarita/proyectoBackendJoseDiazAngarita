import UserDAO from '../dao/mongoDB/userMongo.js';
import UserDTO from '../dto/userDTO.js';
import CartMongo from '../dao/mongoDB/cartMongo.js';
import bcrypt from 'bcrypt';
import transporter from '../config/nodemailer.config.js';
import userModel from '../models/userModel.js';

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

  async hasUploadedRequiredDocuments(user, requiredDocuments) {
    const uploadedDocuments = user.documents.filter(doc => doc.status === 'uploaded').map(doc => doc.name);
    return requiredDocuments.every(doc => uploadedDocuments.includes(doc));
  }

  async getUserById(userId) {
    const user = await userDAO.findById(userId);
    if (user) {
      return new UserDTO(user);
    }
    return null;
  }

  async deleteUser(uid) {
    try {
      return await userModel.deleteOne({ _id: uid });
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async deleteInactiveUsers() {
    const thresholdDate = new Date(Date.now() - 5 * 60 * 1000);

    const deletedUsers = await userDAO.deleteInactiveUsers(thresholdDate);
  
    console.log(`Usuarios eliminados: ${deletedUsers.length}`);
  
    if (deletedUsers.length > 0) {
        // Filtrar los usuarios que no son admin
        const usersToNotify = deletedUsers.filter(user => user.role !== 'admin');
        const notificationPromises = usersToNotify.map(user =>
            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.first_name},\n\nTu cuenta ha sido eliminada debido a la inactividad durante los últimos días. Si tienes alguna duda o quieres reactivar tu cuenta, por favor contáctanos.\n\nSaludos,\nEl equipo de Ecommerce JGDA.`,
            }).catch(error => {
                console.error(`Error enviando correo a ${user.email}:`, error);
            })
        );
  
        await Promise.all(notificationPromises);
    }
  
    return { deletedCount: deletedUsers.length };
} 
}

export default UserService;