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
        console.log('Usuario en sesión al crear producto:', req.session.user);
        const ownerEmail = req.session.user?.email || 'admin@coder.com';
        const productData = {
            ...req.body,
            owner: ownerEmail
        };
        console.log('Datos del producto con owner:', productData); 
        const product = await productService.addProduct(productData);
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
        const { pid } = req.params;
        const user = req.session.user;

        // Obtener el producto para verificar el owner
        const product = await productService.getProductById(pid);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Verificar permisos: solo el owner o un admin puede eliminar
        if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
            const result = await productService.deleteProduct(pid);
            return res.status(200).json({ status: 'success', message: 'Producto remove' });
        } else {
            return res.status(403).json({ status: 'error', message: 'Access denied. You cannot delete this product' });
        }
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        next(error);
    }
};