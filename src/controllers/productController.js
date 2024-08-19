import ProductDTO from '../dto/productDTO.js';
import ProductService from '../services/productService.js';
import { ProductNotFoundError, InvalidProductError, ProductDatabaseError } from '../errors/productErrors.js';
import logger from '../logs/logger.js';
import transporter from '../config/nodemailer.config.js'; 

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
        const ownerEmail = req.session.user?.email || 'admin@coder.com';
        const productData = {
            ...req.body,
            owner: ownerEmail
        }; 
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
        const product = await productService.getProductById(pid);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
            const result = await productService.deleteProduct(pid);

            if (result) {
                if (user.role === 'premium' && product.owner === user.email) {
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: user.email,
                        subject: 'Producto eliminado',
                        text: `Hola ${user.first_name},\n\nEl producto "${product.title}" que poseías ha sido eliminado de la plataforma.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEl equipo de Ecommerce JGDA.`,
                    }).catch(error => {
                        console.error(`Error enviando correo a ${user.email}:`, error);
                    });
                }

                return res.status(200).json({ status: 'success', message: 'Producto eliminado' });
            } else {
                return res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
            }
        } else {
            return res.status(403).json({ status: 'error', message: 'Acceso denegado. No puedes eliminar este producto.' });
        }
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        next(error);
    }
};