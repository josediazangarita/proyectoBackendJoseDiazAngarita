import express from 'express';
import handlebars from "express-handlebars";
import { createServer } from 'http';
import { Server as SocketServer } from "socket.io";
import ProductManager from './models/ProductManager.js';

import __dirname from './utils.js';
import viewsRouter from './views/views.router.js';
import productRoutes from './routes/productsRouters.js';
import cartRoutes from './routes/cartRoutes.js';

// Se crea una instancia de express
const app = express();

// Se establece el puerto
const PORT = process.env.PORT || 8080;

// Servidor HTTP
const httpServer = createServer(app);

// Servidor de sockets
const io = new SocketServer(httpServer);

// Instancia de ProductManager
const productManager = new ProductManager();

//Inicializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());

//Establecemos la ruta de vistas
app.set("views", `${__dirname}/views`);

//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

//Método get que renderiza la pantalla
app.get('/', (req, res) => {
    let testUser = {
        name: "JG",
        last_name: "DA"
    }
    res.render('index', testUser);
});

// Ruta para renderizar la vista home
app.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Ruta para renderizar la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {});
});

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Escucha el puerto
httpServer.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});

// Manejar conexiones WebSocket
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