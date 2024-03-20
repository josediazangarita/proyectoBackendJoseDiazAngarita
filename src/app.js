import express from 'express';
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

//Inicializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());

//Establecemos la ruta de vistas
app.set("views", `${__dirname}/views`)

//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
const socketServer = new Server(httpServer);
