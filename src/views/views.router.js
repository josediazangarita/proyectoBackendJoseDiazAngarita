import express from 'express';

//import ProductManagerFS from '../dao/productManagerFS.js';
import ProductManagerDB from '../dao/productManagerDB.js';

const router = express.Router();
// Se crea una instancia de ProductManager
//const store = new ProductManagerFS(); 
const store = new ProductManagerDB();

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/products', async (req, res) => {
    res.render(
        'products',
        {
            title: 'Productos',
            style: 'style.css',
            products: await store.getProducts()
        }
    )
});

router.get('/realtimeproducts', async (req, res) => {
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'style.css',
            products: await store.getProducts()
        }
    )
});

export default router;