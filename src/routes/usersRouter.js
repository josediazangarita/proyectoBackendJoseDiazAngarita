import { Router } from 'express';
import UserController, { logoutUser } from '../controllers/userController.js';

const router = Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/restorePassword', UserController.restorePassword);
router.get('/logout', logoutUser);

export default router;