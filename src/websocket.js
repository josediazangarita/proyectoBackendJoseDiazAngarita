import productManagerDB from "./dao/productManagerDB.js";

const store = new productManagerDB();

export default (io) => {
    io.on("connection", async socket => {
        console.log('Cliente socket conectado');
        // Enviar la lista de productos al cliente cuando se conecta
        const products = await store.getProducts();
        socket.emit('productList', products);

        // Manejar la creación de productos desde sockets
        socket.on("addProduct", async (newProduct) => {
            const result = await store.addProduct(newProduct);
            io.emit('newProduct', result);
        });

        // Manejar la eliminación de productos desde sockets
        socket.on("deleteProduct", async (pid) => {
            const result = await store.deleteProduct(pid);

            if (result) {
                io.emit('productDeleted', pid);
            }
        });
    });
}