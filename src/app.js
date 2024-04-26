import express from 'express';
import handlebars from "express-handlebars";
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManagerDB from './dao/productManagerDB.js';
import mongoose from 'mongoose'

import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';
import websocket from './websocket.js';

// Se crea una instancia de express
const app = express();

// Instancia de ProductManager
const productManager = new ProductManagerDB();

// Se establece el puerto
const PORT = process.env.PORT || 8080;

// Servidor HTTP y escucha del puerto
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});

// Servidor de sockets
const io = new Server(httpServer);

//Inicializamos el motor de plantillas handlebars, ruta de vistas y motor de renderizado
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Servidor de sockets
websocket(io);

// Conexión a MongoDB
const uri = "mongodb+srv://jgda:jgda@cluster0.abjsbjo.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));