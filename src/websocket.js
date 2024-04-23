//import { productManagerFS } from "./dao/productManagerFS.js";
//const ProductService = new productManagerFS('products.json');
import productManagerDB from "./dao/productManagerDB.js";

const store = new productManagerDB();

export default (io) => {
    io.on("connection", async socket => {
        console.log('Cliente socket conectado');
        // Enviar la lista de productos al cliente cuando se conecta
        const products = await store.getProducts();
        socket.emit('productList', products);

        // Manejar la creación de productos desde sockets
        socket.on("createProduct", (newProduct) => {
            // Agregar el nuevo producto a la lista de productos
            const result = store.addProduct(newProduct);

            // Emitir el evento 'newProduct' a todos los clientes conectados
            io.emit('newProduct', result);
        });

        // Manejar la eliminación de productos desde sockets
        socket.on("deleteProduct", async (pid) => {
            // Eliminar el producto con el ID especificado
            const result = await store.deleteProduct(pid);

            if (result) {
                // Si se eliminó con éxito, emitir el evento 'productDeleted' a todos los clientes conectados
                io.emit('productDeleted', pid);
            }
        });
    });
}