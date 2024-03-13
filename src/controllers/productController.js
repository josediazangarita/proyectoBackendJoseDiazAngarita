// Importacion de la clase ProductManager
import ProductManager from '../models/ProductManager.js';

// Instancia de ProductManager para manejar los productos
const store = new ProductManager();

// Controlador para obtener todos los productos
export const getAllProducts = (req, res) => {
    try {
        let products = store.getProducts(); // Obtener todos los productos del almacenamiento
        const { limit } = req.query;
        if (limit) {
            products = products.slice(0, parseInt(limit)); // Limitar la cantidad de productos según el parámetro "limit"
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener un producto por su ID
export const getProductById = (req, res) => {
    try {
        const { pid } = req.params;
        const product = store.getProductById(pid); // Obtener el producto con el ID especificado
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Product with ID ${pid} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para actualizar un producto por su ID
export const updateProduct = (req, res) => {
    try {
        const { pid } = req.params; 
        const updatedFields = req.body; // Obtener los campos actualizados del cuerpo de la solicitud
        store.updateProduct(pid, updatedFields); // Actualizar el producto con los campos proporcionados
        res.json({ message: `Product with ID ${pid} updated successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para eliminar un producto por su ID
export const deleteProduct = (req, res) => {
    try {
        const { pid } = req.params;
        store.deleteProduct(pid); // Eliminar el producto con el ID especificado
        res.json({ message: `Product with ID ${pid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

