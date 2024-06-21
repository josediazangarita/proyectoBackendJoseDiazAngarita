let productDao;

export const setProductDao = (dao) => {
    productDao = dao;
};

export const getProducts = async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const result = await productDao.getProducts(filter);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.toString() });
    }
};

export const getProductByID = async (req, res) => {
    try {
        const result = await productDao.getProductByID(req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const addProduct = async (req, res) => {
    if (req.files) {
        req.body.thumbnails = req.files.map(file => file.filename);
    }

    try {
        const result = await productDao.addProduct(req.body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    if (req.files) {
        req.body.thumbnails = req.files.map(file => file.filename);
    }

    try {
        const result = await productDao.updateProduct(req.params.pid, req.body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const result = await productDao.deleteProduct(req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};
