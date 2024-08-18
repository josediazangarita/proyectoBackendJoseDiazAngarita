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
        id: userDTO.id,
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
      await userDTO.save();

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

    // Verificar si el usuario es admin y está intentando cambiar su rol a user
    if (user.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'No se puede cambiar el rol de admin a user.',
      });
    }

    // Verificar si el usuario está cambiando de 'user' a 'premium'
    if (user.role === 'user') {
      const requiredCategories = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
      const missingDocuments = requiredCategories.filter(category => {
        return !user.documents.some(doc => doc.category === category && doc.status === 'uploaded');
      });

      if (missingDocuments.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: `El usuario no ha terminado de procesar su documentación. Documentos faltantes o pendientes: ${missingDocuments.join(', ')}`,
        });
      }
    }

    // Cambiar el rol del usuario
    const newRole = user.role === 'user' ? 'premium' : 'user';
    user.role = newRole;

    await userService.updateUser(uid, { role: newRole });

    console.log(`Rol de usuario actualizado: ${user.email} ahora es ${newRole}`);
    res.status(200).json({
      status: 'success',
      message: `El rol de usuario se cambió a ${newRole}`,
      newRole: newRole,
    });
  } catch (error) {
    console.error('Error al cambiar el rol del usuario', { error: error.message, stack: error.stack });
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

export const saveProfileImage = async (req, res, next) => {
  try {
    const { email } = req.session.user;
    console.log('datos del usuario al cargar profileImage', req.session.user)
    
    const userDTO = await userService.getUserByEmail(email);
    if (!userDTO) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    userDTO.profileImage = {
      name: file.originalname,
      reference: `/profile_images/${file.filename}`,
      status: 'uploaded'
    };

    await userDTO.save();
    res.status(200).json({ message: 'Profile image uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const saveProductImages = async (req, res, next) => {
  try {
    const { email } = req.session.user;
    
    const userDTO = await userService.getUserByEmail(email);
    if (!userDTO) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { files } = req;
    const uploadedFiles = Array.isArray(files) ? files : [files];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const productImages = uploadedFiles.map(file => ({
      name: file.originalname,
      reference: file.path,
      status: 'uploaded'
    }));

    userDTO.productImages.push(...productImages);
    await userDTO.save();

    res.status(200).json({ message: 'Product images uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const saveDocuments = async (req, res, next) => {
  try {
    const { email } = req.session.user;

    const userDTO = await userService.getUserByEmail(email);
    if (!userDTO) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { files } = req;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const documentCategories = {
      document1: 'identificacion',
      document2: 'comprobante de domicilio',
      document3: 'comprobante de estado de cuenta'
    };

    const newDocuments = Object.keys(files).map(key => ({
      name: files[key][0].originalname,
      reference: files[key][0].path,
      category: documentCategories[key],
      status: 'uploaded'
    }));

    userDTO.documents = userDTO.documents.filter(doc => 
      !newDocuments.some(newDoc => newDoc.category === doc.category)
    );

    userDTO.documents.push(...newDocuments);

    await userDTO.save();
    res.status(200).json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
      const deletedUsers = await userService.deleteInactiveUsers();
      res.status(200).json({ message: 'Usuarios inactivos eliminados', deletedCount: deletedUsers.deletedCount });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error: error.message });
  }
};

export const deleteUserById = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const result = await userService.deleteUser(uid);

    if (result.deletedCount === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.redirect('/users');
  } catch (error) {
    console.error('Error al eliminar el usuario', { error: error.message, stack: error.stack });
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const user = await userService.getUserById(uid);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default new UserController();