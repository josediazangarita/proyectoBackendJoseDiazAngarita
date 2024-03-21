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
        if (updatedProductId === undefined) {
            res.status(400).json({ error: `No se puede modificar el ID del producto con ID ${pid}` });
        } else {
            res.json({ mensaje: `Producto con ID ${updatedProductId} actualizado correctamente` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid); // Convertir el ID a un número entero
        const deletedProductId = store.deleteProduct(productId); // Llamar a deleteProduct con el ID convertido
        if (deletedProductId === null) {
            res.status(404).json({ error: `No se encuentra el producto con el ID ${productId} para ser eliminado.` });
        } else {
            res.json({ message: `Producto con ID ${deletedProductId} eliminado correctamente` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Crear el nuevo producto con los datos recibidos en la solicitud
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || [], // Si no se proporciona, por defecto es un array vacío
            status: true // Por defecto, el producto está activo
        };

        // Agregar el nuevo producto utilizando el método addProduct de ProductManager
        const result = store.addProduct(newProduct);

        // Verificar si ocurrió un error al agregar el producto
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Producto agregado correctamente
        res.json({ message: 'Producto agregado correctamente', productId: result.productId });
        // Emitir el evento 'newProduct' a través de sockets
        io.emit('newProduct', result);
    } catch (error) {
        // Capturar cualquier error interno y responder con un error 500
        res.status(500).json({ error: error.message });
    }
});

export default router; 