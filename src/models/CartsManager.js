// Clase CartsManager
import { readFileSync, writeFileSync } from 'fs';

export class CartsManager {
    constructor() {
        this.path = './src/data/carts.json';
        this.carts = [];
        this.cartIdCounter = 1;
        this.loadCarts();
    }

    // Método para cargar los carritos desde el archivo
    loadCarts() {
        try {
            const data = readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            // Obtener el contador de ID más alto y establecerlo como el siguiente valor para los IDs
            this.cartIdCounter = Math.max(...this.carts.map(cart => cart.id), 0) + 1;
        } catch (error) {
            console.error('Error al cargar el carrito desde el archivo:', error.message);
        }
    }

    // Método para guardar los carritos en el archivo
    saveCarts() {
        try {
            writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar el carrito en el archivo:', error.message);
        }
    }

    // Método para crear un nuevo carrito y guardarlo en el archivo
    createCart() {
        const cartId = this.cartIdCounter++;
        const cart = { id: cartId, products: [] };
        this.carts.push(cart);
        this.saveCarts();
        return cartId;
    }

    // Método para obtener los productos de un carrito por su ID
    getCartProducts(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart ? cart.products : [];
    }

    // Método para agregar un producto a un carrito por su ID y la cantidad
    addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            const existingProduct = cart.products.find(product => product.id === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }
            this.saveCarts();
        }
    }
}

