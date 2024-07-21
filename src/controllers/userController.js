import UserService from '../services/userService.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';
import { generateUserErrorInfo } from '../errors/generateUserErrorInfo.js';
import { UserNotFoundError, InvalidUserError, AuthenticationError, UnderageUserError } from '../errors/userErrors.js';
import logger from '../logs/logger.js';

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

  async restorePassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;
      if (!newPassword) {
        throw new InvalidUserError(req.body);
      }
      const user = await userService.updateUserPassword(email, createHash(newPassword));
      if (!user) {
        throw new UserNotFoundError(email);
      }
      logger.info('Password restored successfully', { email });
      res.status(200).json({ status: 'success', message: 'Password restored successfully' });
    } catch (error) {
      logger.error('Error restoring password', { error: error.message, stack: error.stack });
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

export default new UserController();