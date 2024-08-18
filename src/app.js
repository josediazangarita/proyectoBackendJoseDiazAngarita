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
import sharedsession from "express-socket.io-session";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import methodOverride from 'method-override';

//import nodemailer from 'nodemailer'
// Custom modules
import viewsRouter from './routes/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';
import usersRouter from './routes/usersRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import ticketRoutes from './routes/ticketRoutes.js';
import websocket from './websocket.js';
import ProductMongo from './dao/mongoDB/productMongo.js';
import ProductMemory from './dao/memory/productMemory.js';
import './utils/handlebarsHelper.js';
import mockingRouter from './routes/mockingRouter.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import errorRouter from './routes/errorRouter.js';
import logger from './logs/logger.js';
import loggerTest from './routes/loggerTest.js';

// Configuración de variables de entorno
dotenv.config();

// Inicializar Passport
initializePassport();

// Se establece el puerto
const PORT = process.env.PORT || 8080;

// Se crea una instancia de express
const app = express();

// Servidor HTTP y escucha del puerto
const httpServer = createServer(app);

// Servidor de sockets
const io = new Server(httpServer);

// Configuración de sesión
const sessionMiddleware = session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 3600
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

// Configura method-override para manejar el método DELETE en formularios
app.use(methodOverride('_method'));

// Compartir sesión con socket.io
io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));

const daoType = process.argv[2];

let productDao;
switch (daoType) {
    case 'mongo':
        productDao = new ProductMongo();
        logger.info('Using MongoDB persistence');
        break;
    case 'memory':
        productDao = new ProductMemory();
        logger.info('Using FileSystem persistence');
        break;
    default:
        logger.error('DAO not specified. Add mongo or memory after npm start to define persistence');
        process.exit(1);
}

// Instancia de ProductService
const productService = new ProductService(productDao);
logger.debug(`ProductService instance created: ${productService}`);

// Conexión a MongoDB (si se seleccionó el DAO de MongoDB)
const mongoURI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI_TEST;

mongoose.connect(mongoURI)
    .then(() => logger.info('Server connected to MongoDB Atlas'))
    .catch(err => logger.error('Error connecting to MongoDB Atlas:', err.message));

// Inicializamos el motor de plantillas handlebars, ruta de vistas y motor de renderizado
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    partialsDir: `${__dirname}/views/partials/`,
    // Permitir a handlebars mostrar prototipos (código Ticket)
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

//Configuración de la documentación con Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación Ecommerce JGDA',
            description: 'Esta documentación cubre toda la API habilitada para Ecommerce JGDA',
        },
    },
    apis: ['./src/docs/**/*.yaml'], //Todos los archivos de configuración de rutas estrán aquí.
    };
const specs = swaggerJsdoc(swaggerOptions);


app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de cookies
app.use(cookieParser());

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
app.use('/api/tickets', ticketRoutes);
app.use('/api/testing', mockingRouter);
app.use('/', errorRouter);
app.use(loggerTest);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//middleware de manejo de errores
app.use(errorMiddleware);

// Servidor de sockets
websocket(io);

httpServer.listen(PORT, () => {
    logger.info(`Server active on port ${PORT}`);
});