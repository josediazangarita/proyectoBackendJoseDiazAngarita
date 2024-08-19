import ProductService from "./services/productService.js";
import ProductMongo from './dao/mongoDB/productMongo.js';
import CartService from './services/cartService.js';
import UserDTO from './dto/userDTO.js';
import transporter from './config/nodemailer.config.js';

// Crear instancias de los servicios
const productDAO = new ProductMongo();
const productService = new ProductService(productDAO);
const cartService = new CartService();
let messages = []; 

export default (io) => {
    io.on("connection", async socket => {
        // Enviar la lista de productos al cliente cuando se conecta
        const products = await productService.getProducts();
        socket.emit('productList', products);

        // Manejar la creación de productos desde sockets
        socket.on("addProduct", async (newProduct) => {
            const ownerEmail = socket.handshake.session?.user?.email || 'admin@coder.com';
            const productData = {
                ...newProduct,
                owner: ownerEmail
            };
            const result = await productService.addProduct(productData);
            io.emit('newProduct', result);
        });

        socket.on('deleteProduct', async (pid) => {
            try {
                const user = socket.handshake.session.user;
        
                // Obtener el producto para verificar el owner
                const product = await productService.getProductById(pid);
        
                if (!product) {
                    return socket.emit('deleteError', 'Producto no encontrado');
                }
        
                // Verificar permisos: solo el owner o un admin puede eliminar
                if (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email)) {
                    const result = await productService.deleteProduct(pid);
                    if (result) {
                        io.emit('productDeleted', pid);
        
                        // Enviar notificación por correo si es necesario
                        if (user.role === 'premium' && product.owner === user.email) {
                            await transporter.sendMail({
                                from: process.env.EMAIL,
                                to: user.email,
                                subject: 'Producto eliminado',
                                text: `Hola, \n\nEl producto "${product.title}" que poseías ha sido eliminado de la plataforma.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEl equipo de Ecommerce JGDA.`,
                            }).catch(error => {
                                console.error(`Error enviando correo a ${user.email}:`, error);
                            });
                        } else if (user.role === 'admin') {
                            // Enviar notificación al propietario del producto si es admin
                            await transporter.sendMail({
                                from: process.env.EMAIL,
                                to: product.owner,
                                subject: 'Producto eliminado por admin',
                                text: `Hola,\n\nEl producto "${product.title}" ha sido eliminado por un administrador de la plataforma.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEl equipo de Ecommerce JGDA.`,
                            }).catch(error => {
                                console.error(`Error enviando correo a ${product.owner}:`, error);
                            });
                        }
                    } else {
                        socket.emit('deleteError', 'Error al eliminar el producto');
                    }
                } else {
                    socket.emit('deleteError', 'Acceso denegado. No puedes eliminar este producto.');
                }
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                socket.emit('deleteError', 'Error interno al intentar eliminar el producto');
            }
        });

        // Evento para recibir el nombre de usuario e inmediatamente enviar los logs del chat
        socket.on('login', () => {
            let user = socket.handshake.session.user;

            if (!user) {
                user = new UserDTO({ _id: null, first_name: 'Visitante', last_name: '', email: '', age: null, password: '', role: 'guest', githubId: null, cart: null });
                socket.handshake.session.user = user;
                socket.handshake.session.save();
            }

            socket.emit('messageLogs', messages);
            socket.user = user;
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
                const updatedCart = await cartService.addProductToCart(cartId, productId, 1); 
                socket.emit('cartUpdated', updatedCart);
                io.emit('cartUpdated', updatedCart); 
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
                io.emit('cartUpdated', updatedCart);
            } catch (error) {
                console.error('Error al eliminar producto del carrito:', error);
                socket.emit('cartError', { message: 'Error al eliminar producto del carrito', error });
            }
        });
    });
}