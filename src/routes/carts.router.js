// Rutas de Cart
import express from 'express';
import CartManager from '../models/CartManager.js';

const router = express.Router();
const cartStore = new CartManager();

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    try {
        const cartId = cartStore.createCart();
        res.json({ message: `Cart created with ID ${cartId}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = cartStore.getCartProducts(cid);
        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar un producto a un carrito por su ID y la cantidad
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        cartStore.addProductToCart(cid, pid, quantity);
        res.json({ message: `Product with ID ${pid} added to cart with ID ${cid}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un carrito por su ID
router.delete('/:cid', (req, res) => {
    try {
        const { cid } = req.params;
        cartStore.deleteCart(cid);
        res.json({ message: `Cart with ID ${cid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

