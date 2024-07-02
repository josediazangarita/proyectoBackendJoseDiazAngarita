import CartMongo from '../dao/mongoDB/cartMongo.js';
import CartDTO from '../dto/cartDTO.js';

class CartService {
    constructor() {
        this.cartDAO = new CartMongo();
    }

    async createCart() {
        const newCart = await this.cartDAO.createCart();
        return new CartDTO(newCart);
    }

    async getAllCarts() {
        const carts = await this.cartDAO.getAllCarts();
        return carts.map(cart => new CartDTO(cart));
    }

    async getCartById(cartId) {
        const cart = await this.cartDAO.getCartById(cartId);
        if (!cart) throw new Error(`Cart with id ${cartId} not found`);
        return new CartDTO(cart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const updatedCart = await this.cartDAO.addProductToCart(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }

    async removeProductFromCart(cartId, productId) {
        const updatedCart = await this.cartDAO.removeProductFromCart(cartId, productId);
        return new CartDTO(updatedCart);
    }

    async updateCart(cartId, products) {
        const updatedCart = await this.cartDAO.updateCart(cartId, products);
        return new CartDTO(updatedCart);
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const updatedCart = await this.cartDAO.updateProductQuantityInCart(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }

    async clearCart(cartId) {
        const clearedCart = await this.cartDAO.clearCart(cartId);
        return new CartDTO(clearedCart);
    }
}

export default CartService;