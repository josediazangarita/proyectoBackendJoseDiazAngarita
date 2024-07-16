import CartService from '../services/cartService.js';
import { CartNotFoundError, InvalidCartError, CartDatabaseError } from '../errors/cartErrors.js';

const cartService = new CartService();

export const getAllCarts = async (req, res, next) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        next(new CartDatabaseError(error.message));
    }
};

export const createCart = async (req, res, next) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        next(new CartDatabaseError(error.message));
    }
};

export const getCartById = async (req, res, next) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            throw new CartNotFoundError(cid);
        }
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addProductToCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(new InvalidCartError({ cartId: cid, productId: pid, quantity }));
    }
};

export const removeProductFromCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartService.removeProductFromCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(new InvalidCartError({ cartId: cid, productId: pid }));
    }
};

export const updateCart = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const updatedCart = await cartService.updateCart(cid, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(new InvalidCartError({ cartId: cid, products }));
    }
};

export const updateProductQuantityInCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        next(new InvalidCartError({ cartId: cid, productId: pid, quantity }));
    }
};

export const clearCart = async (req, res, next) => {
    const { cid } = req.params;
    try {
        const clearedCart = await cartService.clearCart(cid);
        res.status(200).json(clearedCart);
    } catch (error) {
        next(new CartDatabaseError(error.message));
    }
};

export const purchaseCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const userId = req.session.user.id;
        const purchaserEmail = req.session.user.email;

        const result = await cartService.purchaseCart(cartId, userId, purchaserEmail);

        if (result.unavailableProducts) {
            return res.status(200).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        next(new CartDatabaseError(error.message));
    }
};