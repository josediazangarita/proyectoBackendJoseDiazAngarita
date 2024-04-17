import express from 'express';
import handlebars from "express-handlebars";
import { createServer } from 'http';
import { Server as SocketServer } from "socket.io";
import ProductManager from './models/ProductManager.js';
import mongoose from 'mongoose'

import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';

// Se crea una instancia de express
const app = express();

// Instancia de ProductManager
const productManager = new ProductManager();

// Se establece el puerto
const PORT = process.env.PORT || 8080;

// Servidor HTTP y escucha del puerto
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});

//Inicializamos el motor de plantillas handlebars, ruta de vistas y motor de renderizado
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

//Método get que renderiza la pantalla (por revisar)
app.get('/', (req, res) => {
    let testUser = {
        name: "JG",
        last_name: "DA"
    }
    res.render('index', testUser);
});

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para renderizar la vista products
app.get('/products', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Ruta para renderizar la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {});
});

// Servidor de sockets
const io = new SocketServer(httpServer);

// Manejar conexiones WebSocket (pasar lógica a un archivo js separado)
io.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    // Enviar la lista de productos al cliente cuando se conecta
    socket.emit('productList', productManager.getProducts());

    // Manejar la creación de productos desde sockets
    socket.on("createProduct", (newProduct) => {
        // Agregar el nuevo producto a la lista de productos
        const result = productManager.addProduct(newProduct);

        // Emitir el evento 'newProduct' a todos los clientes conectados
        io.emit('newProduct', result);
    });

    // Manejar la eliminación de productos desde sockets
    socket.on("deleteProduct", (productId) => {
        // Eliminar el producto con el ID especificado
        const result = productManager.deleteProduct(productId);

        if (result) {
            // Si se eliminó con éxito, emitir el evento 'productDeleted' a todos los clientes conectados
            io.emit('productDeleted', productId);
        }
    });
});

// Conexión a MongoDB
const uri = "mongodb+srv://jgda:jgda@cluster0.abjsbjo.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));