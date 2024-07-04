import CartModel from '../../models/cartModel.js';

class CartMongo {
    async createCart() {
        const newCart = new CartModel();
        return await newCart.save();
    }

    async getAllCarts() {
        return await CartModel.find().lean();
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).lean();
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);
        
        const existingProduct = cart.products.find(p => p.product.equals(productId));
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);

        cart.products = cart.products.filter(p => !p.product.equals(productId));
        return await cart.save();
    }

    async updateCart(cartId, products) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);

        cart.products = products.map(p => ({
            product: p.productId,
            quantity: p.quantity
        }));

        return await cart.save();
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);

        const product = cart.products.find(p => p.product.equals(productId));
        if (!product) throw new Error(`Product with id ${productId} not found in cart`);

        product.quantity = quantity;
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);

        cart.products = [];
        return await cart.save();
    }
}

export default CartMongo;