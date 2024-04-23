import express from 'express';

import ProductManager from '../dao/ProductManager.js';

const router = express.Router();
const store = new ProductManager(); // Crea una instancia de ProductManager

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/home', (req, res) => {
    try {
        const products = store.getProducts(); // Obtener la lista de productos desde el modelo
        res.render('home', { products }); // Renderiza la vista home y pasa la lista de productos
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {});
});

export default router;