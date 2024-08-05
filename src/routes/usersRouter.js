import { Router } from 'express';
import UserController, { logoutUser } from '../controllers/userController.js';
import { toggleUserRole } from '../controllers/userController.js';
import { isAdmin } from '../middlewares/authorization.js'

const router = Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', UserController.sendPasswordResetEmail);
router.get('/reset-password/:token', UserController.renderPasswordResetForm);
router.post('/reset-password/:token', UserController.resetPassword);
router.get('/validate-reset-token/:token', UserController.validateResetToken);
router.put('/premium/:uid', isAdmin, toggleUserRole);

export default router;