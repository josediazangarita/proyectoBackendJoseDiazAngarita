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

      await userService.createUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      });
      logger.info('User registered successfully', { email });
      res.redirect('/login');
    } catch (error) {
      logger.error('Error registering user', { error: error.message, stack: error.stack });
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user || !isValidPassword(user, password)) {
        throw new AuthenticationError('Invalid email or password');
      }

      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      };
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


}

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error('Error logging out user', { error: err.message, stack: err.stack });
      return next(new AuthenticationError('Error al cerrar sesión'));
    }
    logger.info('User logged out');
    res.redirect('/');
  });
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

export default new UserController();