// Se importa CartsManager
import CartsManager from '../models/CartsManager.js';

// Se crea una instancia de CartManager para manejar los carritos
const cartStore = new CartsManager();

// Controlador para crear un nuevo carrito
export const createCart = (req, res) => {
    try {
        const cartId = cartStore.createCart();
        res.json({ message: `Cart created with ID ${cartId}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener los productos de un carrito por su ID
export const getCartProducts = (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = cartStore.getCartProducts(cid);
        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para agregar un producto a un carrito por su ID y la cantidad
export const addProductToCart = (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        cartStore.addProductToCart(cid, pid, quantity);
        res.json({ message: `Product with ID ${pid} added to cart with ID ${cid}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
