import { Router } from 'express';
import * as ProductController from '../controllers/productController.js';
import { uploader } from '../utils/multerUtil.js';
import { isAdmin, isAdminOrPremium } from '../middlewares/authorization.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:pid', ProductController.getProductById);
router.post('/', uploader.array('thumbnails', 3), isAdminOrPremium, ProductController.addProduct);
router.put('/:pid', uploader.array('thumbnails', 3), isAdmin, ProductController.updateProduct);
router.delete('/:pid', isAdmin,  ProductController.deleteProduct);

export default router;