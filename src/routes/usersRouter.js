import { Router } from 'express';
import UserController, { logoutUser, saveProfileImage, saveProductImages, saveDocuments } from '../controllers/userController.js';
import { toggleUserRole } from '../controllers/userController.js';
import { isAdmin, isUserOrPremium, isAdminOrPremium } from '../middlewares/authorization.js';
import { upload } from '../utils/multerUser.js';

const router = Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/logout', logoutUser);
router.post('/forgot-password', UserController.sendPasswordResetEmail);
router.get('/reset-password/:token', UserController.renderPasswordResetForm);
router.post('/reset-password/:token', UserController.resetPassword);
router.get('/validate-reset-token/:token', UserController.validateResetToken);
router.put('/premium/:uid', isAdmin, toggleUserRole);

// Rutas para cargar archivos
router.post('/:uid/profileImage', isUserOrPremium, upload.single('profileImage'), saveProfileImage);
router.post('/:uid/productImages', isAdminOrPremium, upload.array('productImages'), saveProductImages);
router.post('/:uid/documents', isUserOrPremium, upload.fields([
    { name: 'document1', maxCount: 1 },
    { name: 'document2', maxCount: 1 },
    { name: 'document3', maxCount: 1 }
  ]), saveDocuments);

export default router;