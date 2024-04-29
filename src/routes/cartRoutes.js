// Rutas de Cart
import express from 'express';
import CartManagerFS from '../dao/cartManagerFS.js';

const router = express.Router();
const cartService = new CartManagerFS();

//POST para crear un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart();
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
        const cart = await cartService.getCartById(cid);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: `Cart with ID ${cid} not found`
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
            message: 'Internal Server Error'
        });
    }
});

//POST para agregar un producto al carrito por ID
router.post('/:cid/product/:pid', async (req, res) => {
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
            message: 'Internal Server Error - Unable to add product to cart'
        });
    }
});

export default router;

//Método DELETE elimina del carrito el producto con el ID especificado

//Método PUT para actualizar todo el carrito (recibe como body todo el array de productos)

//Método PUT para actualizar un producto del carrito (recibe como body el producto a actualizar basado en su cantidad). No se puede actualizar el producto desde el carrito.

//Método DELETE para eliminar todos los productoas del carrito