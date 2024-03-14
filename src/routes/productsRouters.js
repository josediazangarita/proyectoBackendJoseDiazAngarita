// Ruta de productos
import express from 'express';
import ProductManager from '../models/ProductManager.js';

const router = express.Router();
const store = new ProductManager();

router.get('/', (req, res) => {
    try {
        let products = store.getProducts();
        const { limit } = req.query;
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', (req, res) => {
    try {
        const product = store.getProductById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Product with ID ${req.params.pid} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body; // Obtener los campos actualizados del cuerpo de la solicitud
        const updatedProductId = store.updateProduct(pid, updatedFields); // Pasar los campos actualizados a updateProduct
        if (updatedProductId) {
            res.json({ mensaje: `Producto con ID ${updatedProductId} actualizado correctamente` });
        } else {
            res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        store.deleteProduct(pid);
        res.json({ message: `Product with ID ${pid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', (req, res) => {
    try {
        const result = store.addProduct(req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.json({ mensaje: 'Producto agregado correctamente', productId: result.productId });
            console.log('producto agregado correctamente');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
