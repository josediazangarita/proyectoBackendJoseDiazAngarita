import { Router } from 'express';
import * as ProductController from '../controllers/productController.js';
import { uploader } from '../utils/multerUtil.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:pid', ProductController.getProductByID);
router.post('/', uploader.array('thumbnails', 3), ProductController.addProduct);
router.put('/:pid', uploader.array('thumbnails', 3), ProductController.updateProduct);
router.delete('/:pid', ProductController.deleteProduct);

export default router;

/* //Filtro por categoría
router.get('/', ProductController.getProducts, async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const result = await productService.getProducts(filter);
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

router.get('/:pid', ProductController.getProductByID, async (req, res) => {

    try {
        const result = await productService.getProductByID(req.params.pid);
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

router.post('/', uploader.array('thumbnails', 3), ProductController.addProduct, async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productService.addProduct(req.body);
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

router.put('/:pid', uploader.array('thumbnails', 3), ProductController.updateProduct, async (req, res) => {

    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        const result = await productService.updateProduct(req.params.pid, req.body);
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

router.delete('/:pid', ProductController.deleteProduct, async (req, res) => {

    try {
        const result = await productService.deleteProduct(req.params.pid);
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

export default router; */





/* router.get('/', async (req, res) => {
    const result = await store.getProducts();

    res.send({
        status: 'success',
        payload: result
    });
}); */