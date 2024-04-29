import { Router } from 'express';
//import { productManagerFS } from '../dao/productManagerFS.js';
import ProductManagerDB from '../dao/productManagerDB.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();
//const ProductService = new productManagerFS('products.json');
const store = new ProductManagerDB();

/* router.get('/', async (req, res) => {
    const result = await store.getProducts();

    res.send({
        status: 'success',
        payload: result
    });
}); */

//Filtro por categoría
router.get('/', async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const result = await store.getProducts(filter);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.toString()
        });
    }
});

router.get('/:pid', async (req, res) => {

    try {
        const result = await store.getProductByID(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await store.addProduct(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await store.updateProduct(req.params.pid, req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', async (req, res) => {

    try {
        const result = await store.deleteProduct(req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;