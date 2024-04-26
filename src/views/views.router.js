import express from 'express';

//import ProductManagerFS from '../dao/productManagerFS.js';
import ProductManagerDB from '../dao/productManagerDB.js';

const router = express.Router();
// Se crea una instancia de ProductManager
//const store = new ProductManagerFS(); 
const store = new ProductManagerDB();

//Ruta para la página principal
router.get('/', (req, res) => {
    res.render('index', { style: 'style.css' });
});

// Ruta para la página de productos
router.get('/products', async (req, res) => {
    const products = await store.getProducts();
    res.render('products', { title: 'Productos', style: 'style.css', products });
});

// Ruta para la página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await store.getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', style: 'style.css', products });
});

export default router;