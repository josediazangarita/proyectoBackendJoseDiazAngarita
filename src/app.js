import express from 'express';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';

import __dirname from './utils.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
