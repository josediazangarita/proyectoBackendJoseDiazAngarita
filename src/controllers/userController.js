import UserService from '../services/userService.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';
import { generateUserErrorInfo } from '../errors/generateUserErrorInfo.js';
import { UserNotFoundError, InvalidUserError, AuthenticationError, UnderageUserError} from '../errors/userErrors.js';

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
      res.redirect('/login');
    } catch (error) {
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
      res.redirect('/products')
    } catch (error) {
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
      res.status(200).json({ status: 'success', message: 'Password restored successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(new AuthenticationError('Error al cerrar sesión'));
    }
    res.redirect('/')
  });
};

export default new UserController();