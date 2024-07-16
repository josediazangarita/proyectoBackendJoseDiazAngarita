import CartMongo from '../dao/mongoDB/cartMongo.js';
import CartDTO from '../dto/cartDTO.js';
import ProductDTO from '../dto/productDTO.js';
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

        for (let item of cart.products) {
            const product = await this.productDAO.getProductById(item.product);
            if (product) {
                console.log('Producto encontrado:', product);
                item.product = new ProductDTO(product);
            } else {
                console.log('Producto no encontrado para el ID:', item.product);
            }
        }
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
    
        if (purchaseDetails.length === 0) {
            return { message: 'No se pudo completar la compra. Algunos productos están fuera de stock', unavailableProducts };
        }
    
        for (const purchaseItem of purchaseDetails) {
            const product = await this.productDAO.getProductById(purchaseItem.product);
            product.stock -= purchaseItem.quantity;
            await product.save();
        }
    
        const ticketData = new TicketDTO({
            code: uuidv4(), 
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: purchaserEmail
        });
    
        const createdTicket = await ticketService.createTicket(ticketData);
        console.log('Ticket creado:', createdTicket);
    
        cart.products = unavailableProducts;
        await cart.save();
    
        return { message: 'Compra completada con éxito', ticket: createdTicket, unavailableProducts };
    }
}

export default CartService;