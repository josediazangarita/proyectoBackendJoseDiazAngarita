// Clase CartsManager
import { readFileSync, writeFileSync } from 'fs';

export default class CartManagerFS {
    constructor() {
        this.path = '../src/data/carts.json';
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
        return cart;
    }

    // Método para obtener un carrito por su ID
    getCartById(cartId) {
        // Convertir el ID a entero y validar que sea un número
        const parsedCartId = parseInt(cartId);
        if (isNaN(parsedCartId)) {
            console.error('El ID del carrito proporcionado no es válido:', cartId);
            return null;
        }
        const cart = this.carts.find(cart => cart.id === parsedCartId);
        return cart ? cart : null;
    }


    // Método para obtener los productos de un carrito por su ID
    getCartProducts(cartId) {
        const cart = this.getCartById(cartId);
        return cart ? cart.products : [];
    }

    // Método para agregar un producto a un carrito por su ID y la cantidad
    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            return null;
        }
        const productQuantity = parseInt(quantity) || 1;
        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += productQuantity;
        } else {
            cart.products.push({ id: productId, quantity: productQuantity });
        }

        await this.saveCarts();
        return cart;
    }



}

