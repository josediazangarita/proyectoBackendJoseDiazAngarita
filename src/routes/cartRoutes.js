// Rutas de Cart
import express from 'express';
import CartManager from '../models/CartManager.js';

const router = express.Router();
const store = new CartManager();

router.post('/', (req, res) => {
    try {
        const newCart = store.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', (req, res) => {
    try {
        const { cid } = req.params;
        const cart = store.getCartById(cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: `Cart with ID ${cid} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = store.addProductToCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;


