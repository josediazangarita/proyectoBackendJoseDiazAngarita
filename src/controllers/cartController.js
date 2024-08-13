import CartService from '../services/cartService.js';
import ProductService from '../services/productService.js';
import ProductMongo from '../dao/mongoDB/productMongo.js';
import { CartNotFoundError, InvalidCartError, CartDatabaseError } from '../errors/cartErrors.js';
import logger from '../logs/logger.js';

const cartService = new CartService();
const productService = new ProductService(new ProductMongo());

export const getAllCarts = async (req, res, next) => {
  try {
    const carts = await cartService.getAllCarts();
    logger.info('Fetched all carts');
    res.status(200).json(carts);
  } catch (error) {
    logger.error('Error fetching carts', { error: error.message, stack: error.stack });
    next(new CartDatabaseError(error.message));
  }
};

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartService.createCart();
    logger.info('Cart created successfully', { cartId: newCart.id });
    res.status(201).json(newCart);
  } catch (error) {
    logger.error('Error creating cart', { error: error.message, stack: error.stack });
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
    logger.info('Fetched cart by ID', { cartId: cid });
    res.status(200).json(cart);
  } catch (error) {
    logger.error('Error fetching cart by ID', { error: error.message, stack: error.stack });
    next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const user = req.session.user;

  try {
    const product = await productService.getProductById(pid);
    //console.log(`Verificación: Product Owner: ${product.owner}, User Email: ${user.email}`);
    if (user.role === 'premium' && product.owner === user.email) {
      console.log('El usuario premium está intentando agregar su propio producto al carrito. Operación denegada.');
      return res.status(403).json({
        status: 'error',
        message: 'No puedes agregar a tu carrito un producto que te pertenece.',
      });
    }

    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    logger.info('Product added to cart', { cartId: cid, productId: pid, quantity });
    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error('Error adding product to cart', { error: error.message, stack: error.stack });
    next(new InvalidCartError({ cartId: cid, productId: pid, quantity }));
  }
};

export const removeProductFromCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    logger.info('Product removed from cart', { cartId: cid, productId: pid });
    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error('Error removing product from cart', { error: error.message, stack: error.stack });
    next(new InvalidCartError({ cartId: cid, productId: pid }));
  }
};

export const updateCart = async (req, res, next) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const updatedCart = await cartService.updateCart(cid, products);
    logger.info('Cart updated', { cartId: cid, products });
    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error('Error updating cart', { error: error.message, stack: error.stack });
    next(new InvalidCartError({ cartId: cid, products }));
  }
};

export const updateProductQuantityInCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
    logger.info('Product quantity updated in cart', { cartId: cid, productId: pid, quantity });
    res.status(200).json(updatedCart);
  } catch (error) {
    logger.error('Error updating product quantity in cart', { error: error.message, stack: error.stack });
    next(new InvalidCartError({ cartId: cid, productId: pid, quantity }));
  }
};

export const clearCart = async (req, res, next) => {
  const { cid } = req.params;
  try {
    const clearedCart = await cartService.clearCart(cid);
    logger.info('Cart cleared', { cartId: cid });
    res.status(200).json(clearedCart);
  } catch (error) {
    logger.error('Error clearing cart', { error: error.message, stack: error.stack });
    next(new CartDatabaseError(error.message));
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const userId = req.session.user.id;
    const purchaserEmail = req.session.user.email;

    const result = await cartService.purchaseCart(cartId, userId, purchaserEmail);

    if (result.unavailableProducts && result.unavailableProducts.length > 0) {
      logger.warning('Purchase completed with unavailable products', { cartId, unavailableProducts: result.unavailableProducts });
      return res.status(200).json(result);
    }

    logger.info('Purchase completed successfully', { cartId, userId, purchaserEmail });
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error purchasing cart', { error: error.message, stack: error.stack });
    next(new CartDatabaseError(error.message));
  }
};