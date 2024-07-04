import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { isUser } from '../middlewares/authorization.js';

const router = express.Router();

router.get('/', cartController.getAllCarts);
router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/products/:pid', isUser, cartController.addProductToCart);
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantityInCart);
router.delete('/:cid', cartController.clearCart);

export default router;
