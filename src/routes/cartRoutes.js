// Rutas de Cart
import express from 'express';
import cartManagerDB from '../dao/cartManagerDB.js';
import cartModel from '../models/cartModel.js';

const router = express.Router();
const cartService = new cartManagerDB();

//GET para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find({}).populate('products.product');
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).json({ message: "Error al obtener los carritos" });
    }
});


//POST para crear un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new cartModel({});
        await newCart.save();
        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor - No se pudo crear el carrito'
        });
    }
});

//GET para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: `Carrito con el ID ${cid} no encontrado`
            });
        }
        res.json({
            status: 'success',
            payload: cart
        });

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del seridor'
        });
    }
});

//POST para agregar un producto al carrito por ID
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;

    try {
        const updatedCart = await cartService.addProductToCart(cid, pid, quantity);

        if (!updatedCart) {
            return res.status(404).json({
                status: 'error',
                message: `No se pudo agregar el producto con ID ${pid} al carrito con ID ${cid} porque uno o ambos no existen.`
            });
        }

        res.status(200).json({
            status: 'success',
            payload: updatedCart
        });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor - No se pudo agregar el producto al carrito'
        });
    }
});

//Método DELETE elimina del carrito el producto con el ID especificado
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartService.removeProductFromCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al intentar borrar producto del carrito", error);
        res.status(500).json({ message: error.message });
    }
});

//Método PUT para actualizar todo el carrito (recibe como body todo el array de productos)
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const updatedCart = await cartService.updateCart(cid, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error in PUT /api/carts/:cid:", error);
        res.status(500).json({ message: error.message });
    }
});

//Método PUT para actualizar un producto del carrito (recibe como body el producto a actualizar basado en su cantidad). No se puede actualizar el producto desde el carrito.
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error in PUT /api/carts/:cid/products/:pid:", error);
        res.status(500).json({ message: error.message });
    }
});


//Método DELETE para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const clearedCart = await cartService.clearCart(cid);
        res.json(clearedCart);
    } catch (error) {
        console.error("Error al intentar borrar los productos del carrito", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
