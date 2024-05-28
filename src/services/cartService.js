import CartModel from '../models/cartModel.js';

class CartService {
    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        cart.products.push({ product: productId, quantity });
        await cart.save();

        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        cart.products = cart.products.filter(item => item.product != productId);
        await cart.save();

        return cart;
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        const product = cart.products.find(item => item.product == productId);

        if (!product) {
            throw new Error(`Product with id ${productId} not found in cart`);
        }

        product.quantity = quantity;
        await cart.save();

        return cart;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        cart.products = [];
        await cart.save();

        return cart;
    }
}

export default CartService;