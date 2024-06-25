import ProductDTO from '../dto/productDTO.js';
import ProductService from '../services/productService.js';

const productService = new ProductService();

export const getProducts = async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const products = await productService.getProducts(filter);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.toString() });
    }
};

export const getProductByID = async (req, res) => {
    try {
        const product = await productService.getProductByID(req.params.pid);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const product = await productService.addProduct(req.body);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.pid, req.body);
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.pid);
        res.send({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};
