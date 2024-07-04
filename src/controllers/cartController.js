import CartService from '../services/cartService.js';

const cartService = new CartService();

export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartService.removeProductFromCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const updatedCart = await cartService.updateCart(cid, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const clearedCart = await cartService.clearCart(cid);
        res.status(200).json(clearedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const userId = req.session.user.id;
        const purchaserEmail = req.session.user.email;
        
        const unavailableProducts = await cartService.purchaseCart(cartId, userId,  purchaserEmail);
        
        if (unavailableProducts.length > 0) {
            return res.status(200).json({ message: 'Compra completada parcialmente', unavailableProducts });
        }

        res.status(200).json({ message: 'Compra completada con éxito' });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ message: 'Error al finalizar la compra', error });
    }
};