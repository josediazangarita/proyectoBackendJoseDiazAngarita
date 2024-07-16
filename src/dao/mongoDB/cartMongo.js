import CartModel from '../../models/cartModel.js';
import { CartNotFoundError, InvalidCartError, CartDatabaseError } from '../../errors/cartErrors.js';
class CartMongo {
    async createCart() {
        try {
            const newCart = new CartModel();
            return await newCart.save();
        } catch (error) {
            throw new CartDatabaseError('Error al crear el carrito');
        }
    }

    async getAllCarts() {
        try {
            return await CartModel.find().lean();
        } catch (error) {
            throw new CartDatabaseError('Error al obtener todos los carritos');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) throw new CartNotFoundError(cartId);
            return cart;
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al obtener el carrito');
            }
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartNotFoundError(cartId);

            const existingProduct = cart.products.find(p => p.product.equals(productId));
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al agregar el producto al carrito');
            }
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartNotFoundError(cartId);

            cart.products = cart.products.filter(p => !p.product.equals(productId));
            return await cart.save();
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al eliminar el producto del carrito');
            }
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartNotFoundError(cartId);

            cart.products = products.map(p => ({
                product: p.productId,
                quantity: p.quantity
            }));

            return await cart.save();
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al actualizar el carrito');
            }
        }
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartNotFoundError(cartId);

            const product = cart.products.find(p => p.product.equals(productId));
            if (!product) throw new InvalidCartError(`Product with id ${productId} not found in cart`);

            product.quantity = quantity;
            return await cart.save();
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al actualizar la cantidad del producto en el carrito');
            }
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartNotFoundError(cartId);

            cart.products = [];
            return await cart.save();
        } catch (error) {
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw new CartNotFoundError(cartId);
            } else {
                throw new CartDatabaseError('Error al vaciar el carrito');
            }
        }
    }
}

export default CartMongo;