import ProductDTO from '../dto/productDTO.js';
import ProductService from '../services/productService.js';
import {ProductNotFoundError, InvalidProductError, ProductDatabaseError} from '../errors/productErrors.js'

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const products = await productService.getProducts(filter);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        next(new ProductDatabaseError(null, error.message));
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const product = await productService.addProduct(req.body);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.pid, req.body);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return next(error);
        } else if (error instanceof InvalidProductError) {
            return next(error);
        } else {
            return next(new ProductDatabaseError(req.body, error.message));
        }
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.pid);
        res.send({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        next(new ProductNotFoundError(req.params.pid));
    }
};