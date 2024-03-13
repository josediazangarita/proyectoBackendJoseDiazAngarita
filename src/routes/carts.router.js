// Rutas de Cart
import express from 'express';
import { createCart, getCartProducts, addProductToCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartProducts);
router.post('/:cid/product/:pid', addProductToCart);

export default router;
