import CartMongo from '../dao/mongoDB/cartMongo.js';
import CartDTO from '../dto/cartDTO.js';
import ProductMongo from '../dao/mongoDB/productMongo.js'
import TicketService from './ticketService.js';
import TicketDTO from '../dto/ticketDTO.js';
import { v4 as uuidv4 } from 'uuid';

const ticketService = new TicketService();
class CartService {
    constructor() {
        this.cartDAO = new CartMongo();
        this.productDAO = new ProductMongo();
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

    async purchaseCart(cartId, userId, purchaserEmail) {
        const cart = await this.cartDAO.getCartById(cartId);
        if (!cart) throw new Error('Cart not found');
    
        const unavailableProducts = [];
        const purchaseDetails = [];
        let totalAmount = 0;
    
        // Primero verificar la disponibilidad de todos los productos
        for (const cartItem of cart.products) {
            try {
                const product = await this.productDAO.getProductById(cartItem.product);
                if (product.stock < cartItem.quantity) {
                    unavailableProducts.push(cartItem);
                } else {
                    purchaseDetails.push(cartItem);
                    totalAmount += product.price * cartItem.quantity;
                }
            } catch (error) {
                console.error(`Error en getProductById: ${error.message}`);
                unavailableProducts.push(cartItem);
            }
        }
    
        // Si no hay productos disponibles para la compra, retornar un error
        if (purchaseDetails.length === 0) {
            return { message: 'No se pudo completar la compra. Todos los productos están fuera de stock', unavailableProducts };
        }
    
        // Procesar la compra de productos con suficiente stock
        for (const purchaseItem of purchaseDetails) {
            const product = await this.productDAO.getProductById(purchaseItem.product);
            product.stock -= purchaseItem.quantity;
            await product.save();
        }
    
        // Crear un ticket para la compra utilizando el DTO del Ticket
        const ticketData = new TicketDTO({
            code: uuidv4(), // Generar un código único
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: purchaserEmail
        });
    
        await ticketService.createTicket(ticketData);
    
        // Actualizar el carrito con los productos no comprados
        cart.products = unavailableProducts;
        await cart.save();
    
        return { message: 'Compra completada con éxito', unavailableProducts };
    }
}

export default CartService;