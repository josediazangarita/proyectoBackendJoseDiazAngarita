// Clase CartsManager
//Se importa el módulo de Mongoose para manipular archivos
import cartModel from '../models/cartModel.js';

class CartManagerDB {

    // Método para crear un nuevo carrito
    async createCart() {
        try {
            const newCart = new cartModel({});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error.message);
            throw error;
        }
    }

    // Método para actualizar un carrito
    async updateCart(cartId, products) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        cart.products = products;
        await cart.save();
        return cart;
    }
    catch(error) {
        console.error('Error actualizanto el carrito:', error.message);
        throw error;
    }

    // Método para obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error.message);
            throw error;
        }
    }

    // Método para obtener los productos de un carrito por su ID
    async getCartProducts(cartId) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product');
            return cart ? cart.products : [];
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error.message);
            throw error;
        }
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productQuantity = parseInt(quantity) || 1;
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += productQuantity;
            } else {
                cart.products.push({ product: productId, quantity: productQuantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            throw error;
        }
    }

    // Método para actualizar la cantidad de un producto en el carrito
    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Encuentra el producto y actualiza su cantidad
            const product = cart.products.find(p => p.product.toString() === productId);
            if (!product) {
                throw new Error('Producto no encontrado en el carrito');
            }

            product.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error actualizando la cantidad de un producto en el carrito:', error.message);
            throw error;
        }
    }


    // Método para eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error.message);
            throw error;
        }
    }

    /* // Método para limpiar un carrito
    async clearCart(cartId) {
        try {
            const cart = await cartModel.findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true });
            return cart;
        } catch (error) {
            console.error('Error al limpiar el carrito:', error.message);
            throw error;
        }
    } */

}

export default CartManagerDB;