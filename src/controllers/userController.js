import UserService from '../services/userService.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';

const userService = new UserService();

class UserController {
  async registerUser(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const newUser = await userService.createUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      });
      res.redirect('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user || !isValidPassword(user, password)) {
        return res.status(401).send('Invalid email or password');
      }

      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      };
      res.redirect('/products');
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Error logging in user');
    }
  }

  async restorePassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      const user = await userService.updateUserPassword(email, createHash(newPassword));
      if (!user) {
        return res.status(404).send('User not found with that email.');
      }
      res.redirect('/login');
    } catch (error) {
      console.error('Error restoring password:', error);
      res.status(500).send('Error restoring password');
    }
  }
}

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.redirect('/login');
  });
};

export default new UserController();