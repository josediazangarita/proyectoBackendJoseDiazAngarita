import ProductDTO from '../dto/productDTO.js';
import ProductService from '../services/productService.js';
import { ProductNotFoundError, InvalidProductError, ProductDatabaseError } from '../errors/productErrors.js';
import logger from '../logs/logger.js';

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const products = await productService.getProducts(filter);
        logger.info('Fetched all products', { filter });
        res.send({ status: 'success', payload: products });
    } catch (error) {
        logger.error('Error fetching products', { error: error.message, stack: error.stack });
        next(new ProductDatabaseError(error.message));
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) {
            throw new ProductNotFoundError(req.params.pid);
        }
        logger.info('Fetched product by ID', { productId: req.params.pid });
        res.send({ status: 'success', payload: product });
    } catch (error) {
        logger.error('Error fetching product by ID', { error: error.message, stack: error.stack });
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const product = await productService.addProduct(req.body);
        logger.info('Product added', { product });
        res.send({ status: 'success', payload: product });
    } catch (error) {
        logger.error('Error adding product', { error: error.message, stack: error.stack });
        next(new InvalidProductError(req.body));
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.pid, req.body);
        logger.info('Product updated', { productId: req.params.pid, product });
        res.send({ status: 'success', payload: product });
    } catch (error) {
        logger.error('Error updating product', { error: error.message, stack: error.stack });
        if (error.name === 'ValidationError') {
            next(new InvalidProductError(req.body));
        } else {
            next(new ProductDatabaseError(error.message));
        }
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.pid);
        logger.info('Product deleted', { productId: req.params.pid });
        res.send({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        logger.error('Error deleting product', { error: error.message, stack: error.stack });
        next(new ProductNotFoundError(req.params.pid));
    }
};