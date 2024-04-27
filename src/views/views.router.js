import express from 'express';
import productModel from '../dao/models/productModel.js';

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

// Ruta para la página de productos para mostrar la página de productos con filtrado opcional
router.get('/products', async (req, res) => {
    console.log("🚀 ~ router.get ~ req:", req);

    let { category, page = 1 } = req.query;
    page = parseInt(page);
    if (isNaN(page) || page < 1) page = 1;

    let filter = {};
    if (category && category !== '') {
        filter.category = category;
    }

    const limit = 10;
    const baseURL = "http://localhost:8080/products";

    try {
        const options = { page, limit, lean: true };
        const result = await productModel.paginate(filter, options);

        // Construir enlaces de paginación
        const queryParams = new URLSearchParams(req.query);
        queryParams.set('page', result.prevPage || 1);
        const prevLink = result.hasPrevPage ? `${baseURL}?${queryParams.toString()}` : null;
        queryParams.set('page', result.nextPage || 1);
        const nextLink = result.hasNextPage ? `${baseURL}?${queryParams.toString()}` : null;

        res.render('products', {
            title: 'Productos',
            style: 'style.css',
            products: result.docs,
            category,
            pagination: {
                totalPages: result.totalPages,
                currentPage: page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink
            }
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).render('error', { error: error });
    }
});



// Ruta para la página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    let filter = {};
    if (req.query.category && req.query.category !== '') {
        filter.category = req.query.category;
    }
    const products = await store.getProducts(filter);
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', style: 'style.css', products });
});

export default router;