import productService from "./services/productService.js";
import CartService from './services/cartService.js';
import UserDTO from './dto/userDTO.js';


const store = new productService();
const cartService = new CartService();
let messages = []; 

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
                user = new UserDTO({ _id: null, first_name: 'Visitante', last_name: '', email: '', age: null, password: '', role: 'guest', githubId: null, cart: null });
                socket.handshake.session.user = user;
                socket.handshake.session.save();
                console.log('Usuario asignado como Visitante'); // Log para verificar si se asignó Visitante
            }

            socket.emit('messageLogs', messages);
            socket.user = user;
            console.log(`Usuario ${user.firstName} conectado al chat de sockets con rol ${user.role}`);
            socket.broadcast.emit('userConnected', user.firstName);
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

        // Manejar la adición de productos al carrito desde sockets
        socket.on("addToCart", async ({ cartId, productId }) => {
            try {
                const updatedCart = await cartService.addProductToCart(cartId, productId, 1); // Puedes ajustar la cantidad según sea necesario
                socket.emit('cartUpdated', updatedCart);
                io.emit('cartUpdated', updatedCart); // Emitir a todos los clientes conectados para actualizar el contador
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                socket.emit('cartError', { message: 'Error al agregar producto al carrito', error });
            }
        });

        // Manejar la eliminación de productos del carrito desde sockets
        socket.on("removeFromCart", async ({ cartId, productId }) => {
            try {
                const updatedCart = await cartService.removeProductFromCart(cartId, productId);
                socket.emit('cartUpdated', updatedCart);
                io.emit('cartUpdated', updatedCart); // Emitir a todos los clientes conectados para actualizar el contador
            } catch (error) {
                console.error('Error al eliminar producto del carrito:', error);
                socket.emit('cartError', { message: 'Error al eliminar producto del carrito', error });
            }
        });
    });
}