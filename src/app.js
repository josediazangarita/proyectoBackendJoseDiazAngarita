import express from 'express';
import handlebars from "express-handlebars";
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManagerDB from './dao/productManagerDB.js';
import mongoose from 'mongoose'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
//import fileStore from 'session-file-store';

import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';
import usersRouter from './routes/usersRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import websocket from './websocket.js';


// Se crea una instancia de fileStore para las sesiones
//const fileStorage = fileStore(session);

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

// Conexión a MongoDB
const uri = "mongodb+srv://jgda:jgda@cluster0.abjsbjo.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

//Inicializamos el motor de plantillas handlebars, ruta de vistas y motor de renderizado
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    partialsDir: `${__dirname}/views/partials/`
}));
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de cookies
app.use(cookieParser());

// Middleware de sesiones con MongoStore
 app.use(session(
    {
        store: MongoStore.create(
            {
                mongoUrl: uri,
                ttl: 3600
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
)); 

// Middleware para hacer los datos del usuario disponibles en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

/*// Middleware de sesiones con filestorage
app.use(session(
    {
        store: new fileStorage({
            path: './sessions',
            ttl: 100,
            retries: 0

        }),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
));*/


// Rutas
app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionRouter);


// Servidor de sockets
websocket(io);

