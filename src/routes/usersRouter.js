import { Router } from 'express';
import UserController, { logoutUser, saveProfileImage, saveProductImages, saveDocuments, deleteUserById, getAllUsers, getUserById } from '../controllers/userController.js';
import { toggleUserRole } from '../controllers/userController.js';
import { isAdmin, isUserOrPremium, isAdminOrPremium } from '../middlewares/authorization.js';
import { upload } from '../utils/multerUser.js';
import { deleteInactiveUsers } from '../controllers/userController.js';

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

//Ruta para eliminar usuarios inactivos}
router.delete('/inactive', isAdmin, deleteInactiveUsers);

//ruta para eliminar usuarios por Id
router.post('/:uid', isAdmin, deleteUserById);

// Ruta para obtener todos los usuarios
router.get('/', isAdmin, getAllUsers);

// Ruta para obtener un usuario específico por ID
router.get('/:uid', getUserById);


export default router;