import express from 'express';
import handlebars from "express-handlebars";
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductService from './services/productService.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import dotenv from 'dotenv';

import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';
import usersRouter from './routes/usersRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import websocket from './websocket.js';

// Se crea una instancia de express
const app = express();

//Configuración de variables de entorno
dotenv.config();

// Inicializar Passport
initializePassport();

// Instancia de ProductManager
const productManager = new ProductService();

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
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err.message));

// Inicializamos el motor de plantillas handlebars, ruta de vistas y motor de renderizado
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    partialsDir: `${__dirname}/views/partials/`
}));
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de cookies
app.use(cookieParser());

// Middleware de sesiones con MongoStore
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 3600
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware para hacer los datos del usuario disponibles en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Rutas
app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionRouter);

// Servidor de sockets
websocket(io);

//Chat con sockets
let messages = [];

io.on('connection', socket => {
    console.log('Usuario conectado');

    // Evento para recibir el nombre de usuario e inmediatamente enviar los logs del chat
    socket.on('login', user => {
        socket.emit('messageLogs', messages);

        // Emitir mensaje a todos los demás usuarios sobre la nueva conexión
        socket.broadcast.emit('userConnected', user);
        console.log(`User ${user} connected`);
    });

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });
});
