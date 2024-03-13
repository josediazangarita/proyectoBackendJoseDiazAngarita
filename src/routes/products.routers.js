// Ruta de productos
import express from 'express';
import { getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;
