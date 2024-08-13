import UserService from '../services/userService.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';
import { generateUserErrorInfo } from '../errors/generateUserErrorInfo.js';
import { UserNotFoundError, InvalidUserError, AuthenticationError, UnderageUserError } from '../errors/userErrors.js';
import logger from '../logs/logger.js';
import transporter from '../config/nodemailer.config.js';
import crypto from 'crypto';
import userModel from '../models/userModel.js';

const userService = new UserService();

class UserController {
  async registerUser(req, res, next) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        throw new InvalidUserError(generateUserErrorInfo(req.body));
      }

      if (age < 18) {
        throw new UnderageUserError(age);
      }

      const result= await userService.createUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      });
      logger.info('User registered successfully', { email });
      res.redirect('/login');
      //res.send({status:"succes", payload:result}); //Se cambia el redirect para realizar el test de integración.  
    } catch (error) {
      logger.error('Error registering user', { error: error.message, stack: error.stack });
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const userDTO = await userService.getUserByEmail(email);

      if (!userDTO || !isValidPassword(userDTO, password)) {
        throw new AuthenticationError('Invalid email or password');
      }

      req.session.user = {
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        email: userDTO.email,
        age: userDTO.age,
        role: userDTO.role,
        cart: userDTO.cart,
        last_connection: userDTO.last_connection
      };

      // Actualizar last_connection en el login
      userDTO.last_connection = new Date();
      await userDTO.save();

      logger.info('User logged in', { email });
      res.redirect('/products');
    } catch (error) {
      logger.error('Error logging in user', { error: error.message, stack: error.stack });
      next(error);
    }
  }

  async sendPasswordResetEmail(req, res, next) {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new UserNotFoundError(email);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000;
        await userService.savePasswordResetToken(email, token, expiration);

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
        };

        await transporter.sendMail(mailOptions);

        logger.info('Password reset email sent', { email: user.email });
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        logger.error('Error sending password reset email', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error sending password reset email' });
    }
}

async validateResetToken(req, res, next) {
  try {
      const { token } = req.params;
      const user = await userService.findByPasswordResetToken(token);

      if (!user || user.resetPasswordExpires < Date.now()) {
          return res.status(400).json({ message: 'Token expirado o inválido', expired: true });
      }

      return res.status(200).json({ message: 'Token válido', expired: false });
  } catch (error) {
      logger.error('Error validando el token', { error: error.message, stack: error.stack });
      next(error);
  }
}

async renderPasswordResetForm(req, res, next) {
  try {
      const { token } = req.params;
      res.render('passwordReset', { token });
  } catch (error) {
      logger.error('Error rendering password reset form', { error: error.message, stack: error.stack });
      next(error);
  }
}

  async resetPassword(req, res, next) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userService.findByPasswordResetToken(token);
        if (!user || user.resetPasswordExpires < Date.now()) {
          return res.status(400).json({ message: 'El token de restablecimiento de contraseña es inválido o ha expirado.' });
      }

        const isSamePassword = await isValidPassword(user, password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'La nueva contraseña debe ser diferente de la antigua.' });
        }

        const updatedUser = await userModel.findById(user.id);
        if (!updatedUser) {
            throw new UserNotFoundError(user.email);
        }

        updatedUser.password = await userService.hashPassword(password);
        updatedUser.resetPasswordToken = undefined;
        updatedUser.resetPasswordExpires = undefined;
        await updatedUser.save();

        logger.info('Password reset successfully', { email: user.email });
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error('Error resetting password', { error: error.message, stack: error.stack });
        next(error);
    }
}

async uploadDocuments(req, res, next) {
  try {
    const { profileImages, productImages, documents } = req.files;

    if (!profileImages && !productImages && !documents) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Recupera el email desde la sesión
    const userEmail = req.session.user?.email;
    if (!userEmail) {
      throw new UserNotFoundError('User email is undefined');
    }

    const user = await userService.getUserByEmail(userEmail);
    if (!user) {
      throw new UserNotFoundError(`The user with email: ${userEmail} does not exist`);
    }

    if (documents) {
      const uploadedDocuments = documents.map(doc => ({
        name: doc.originalname,
        reference: doc.path,
        status: 'uploaded'
      }));

      user.documents.push(...uploadedDocuments);
    }

    if (profileImages) {
      const uploadedProfileImages = profileImages.map(img => ({
        name: img.originalname,
        reference: img.path,
        status: 'uploaded'
      }));

      user.profileImages.push(...uploadedProfileImages);
    }

    if (productImages) {
      const uploadedProductImages = productImages.map(img => ({
        name: img.originalname,
        reference: img.path,
        status: 'uploaded'
      }));

      user.productImages.push(...uploadedProductImages);
    }

    await user.save();

    res.status(200).json({ 
      message: 'Documents uploaded successfully', 
      profileImages, 
      productImages, 
      documents 
    });
  } catch (error) {
    logger.error('Error uploading documents', { error: error.message, stack: error.stack });
    next(error);
  }
}
}

export const logoutUser = async (req, res, next) => {
  try {
      const userSession = req.session.user;
      
      if (!userSession) {
          throw new AuthenticationError('No user session found');
      }

      const userDTO = await userService.getUserByEmail(userSession.email);

      if (!userDTO) {
          throw new AuthenticationError('User not found');
      }

      userDTO.last_connection = new Date();
      await userDTO.save();  // Usa el método save del DTO

      req.session.destroy(err => {
          if (err) {
              logger.error('Error destroying session', { error: err.message, stack: err.stack });
              return next(err);
          }
          
          logger.info('User logged out', { email: userSession.email });
          res.redirect('/login');
      });
  } catch (error) {
      logger.error('Error logging out user', { error: error.message, stack: error.stack });
      next(error);
  }
};

export const toggleUserRole = async (req, res, next) => {
  const { uid } = req.params;

  try {
      const user = await userService.getUserById(uid);

      if (!user) {
          return res.status(404).json({
              status: 'error',
              message: 'Usuario no encontrado',
          });
      }

      const newRole = user.role === 'user' ? 'premium' : 'user';
      user.role = newRole;

      await userService.updateUser(uid, { role: newRole });

      logger.info(`Rol de usuario actualizado: ${user.email} ahora es ${newRole}`);
      res.status(200).json({
          status: 'success',
          message: `El rol de usuario se cambió a ${newRole}`,
          newRole: newRole,
      });
  } catch (error) {
      logger.error('Error al cambiar el rol del usuario', { error: error.message, stack: error.stack });
      next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
      const users = await userService.getAllUsers();
      res.locals.users = users;
      next();
  } catch (error) {
      next(error);
  }
};

export default new UserController();