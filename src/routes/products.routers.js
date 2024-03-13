// Ruta de productos
import express from 'express';
import ProductManager from '../models/ProductManager.js';

const router = express.Router();
const store = new ProductManager();

// Ruta para obtener todos los productos
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

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const product = store.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Product with ID ${pid} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        store.deleteProduct(parseInt(pid));
        res.json({ message: `Product with ID ${pid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    try {
        // Obtener los datos del producto del cuerpo de la solicitud
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Verificar que los campos obligatorios no estén vacíos
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'All fields except thumbnails are required' });
        }

        // Crear el objeto de producto con los datos recibidos
        const newProduct = {
            id: store.productIdCounter++,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [] // Si no se proporcionan thumbnails, establecer un array vacío
        };

        // Agregar el nuevo producto al almacenamiento
        store.addProduct(newProduct);

        // Responder con un mensaje de éxito
        res.json({ message: 'Product added successfully', productId: newProduct.id });
    } catch (error) {
        // En caso de error, responder con un mensaje de error
        res.status(500).json({ error: error.message });
    }
});

export default router;

