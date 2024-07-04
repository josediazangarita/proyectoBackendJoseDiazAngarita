import productService from "./services/productService.js";

const store = new productService();
let messages = [];  // Definir messages aquí

export default (io) => {
    io.on("connection", async socket => {
        console.log('Cliente conectado a socket');
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

        // Evento para recibir el nombre de usuario e inmediatamente enviar los logs del chat
        socket.on('login', () => {
            let user = socket.handshake.session.user;
            if (!user) {
                user = { name: 'Visitante', role: 'guest' };
                socket.handshake.session.user = user;
                socket.handshake.session.save();
            }
            socket.emit('messageLogs', messages);
            socket.user = user; // Guardar usuario en el socket
            console.log(`Usuario ${user.name} conectado al chat de sockets con rol ${user.role}`);
            socket.broadcast.emit('userConnected', user.name);
        });

        socket.on('message', data => {
            const currentUser = socket.handshake.session.user;
            if (currentUser && currentUser.role === 'user') {
                messages.push(data);
                io.emit('messageLogs', messages);
            } else {
                socket.emit('statusError', 'Acceso denegado. Solo usuarios registrados pueden enviar mensajes.');
            }
        });
    });
}