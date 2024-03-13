import express from 'express';

import ProductManager from './models/ProductManager.js';

const app = express();
const PORT = 8080;

const store = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener todos los productos o una cantidad específica
app.get('api/products', async (req, res) => {
    try {
        let products = store.getProducts(); // Se obtienen todos los productos
        const { limit } = req.query;
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producto por ID
app.get('api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }
        const product = await store.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});