import express from 'express';
import productModel from '../models/productModel.js';

import ProductService from '../services/productService.js';
import auth from '../middlewares/auth.js';
import { isAdminOrPremium, isUserOrPremium, isAdmin } from '../middlewares/authorization.js';
import CartService from '../services/cartService.js'
import TicketService from '../services/ticketService.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();
const store = new ProductService();
const cartService = new CartService();
const ticketService = new TicketService();

//Ruta para la página principal
router.get('/', (req, res) => {
    res.render(
        'index',
        {
            style: 'style.css',
            user: req.session.user
        });
});

// Ruta para la página de productos para mostrar la página de productos con filtrado opcional
router.get('/products', async (req, res) => {
    let { category, sort = 'asc', page = 1 } = req.query;
    page = parseInt(page);
    if (isNaN(page) || page < 1) page = 1;

    let filter = {};
    if (category && category !== '') {
        filter.category = category;
    }

    // Configurar la dirección del ordenamiento
    let sortOptions = {};
    if (sort === 'desc') {
        sortOptions.price = -1;
    } else {
        sortOptions.price = 1; // Por defecto ordena ascendente
    }

    const limit = 9;
    const baseURL = "https://proyectobackendjosediazangarita.onrender.com/products";

    try {
        const options = {
            page,
            limit,
            lean: true,
            sort: sortOptions
        };
        const result = await productModel.paginate(filter, options);

        // Construir enlaces de paginación
        const queryParams = new URLSearchParams(req.query);
        queryParams.set('page', result.prevPage || 1);
        const prevLink = result.hasPrevPage ? `${baseURL}?${queryParams.toString()}` : null;
        queryParams.set('page', result.nextPage || 1);
        const nextLink = result.hasNextPage ? `${baseURL}?${queryParams.toString()}` : null;

        res.render('products', {
            title: 'Productos',
            style: 'style.css',
            products: result.docs,
            category,
            sort,
            pagination: {
                totalPages: result.totalPages,
                currentPage: page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink
            }
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).render('error', { error: error });
    }
});




// Ruta para la página de productos en tiempo real
router.get('/realtimeproducts', auth, isAdminOrPremium, async (req, res) => {
    let filter = {};
    if (req.query.category && req.query.category !== '') {
        filter.category = req.query.category;
    }
    const products = await store.getProducts(filter);
    res.render('realTimeProducts', { user: req.session.user, title: 'Productos en Tiempo Real', style: 'style.css', products });
});

//Ruta login
router.get("/login", (req, res) => {
    res.render(
        'login',
        {
            title: 'Login Ecommerce JG',
            style: 'style.css',
            failLogin: req.session.failLogin ?? false
        }
    )
});

//Ruta register
router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'Register Ecommerce JG',
            style: 'style.css',
            failRegister: req.session.failRegister ?? false
        }
    )
});

router.get('/restorePassword', (req, res) => {
    res.render('passwordResetRequest', 
        {
        title: 'Restore Password Ecommerce JG',
        style: 'style.css'
    });
});

router.get('/reset-password/:token', (req, res) => {
    res.render('passwordReset', {
        title: 'Reset Password Ecommerce JG',
        style: 'style.css',
        token: req.params.token
    });
});

// Ruta para la vista de chat
router.get('/chat', (req, res) => {
    res.render(
        'chat',
        {
            style: 'style.css',
            user: req.session.user
        });
});

// Ruta para la vista del carrito
router.get('/cart', isUserOrPremium, async (req, res) => {
    try {
        const cartId = req.session.user.cart;
        const cart = await cartService.getCartById(cartId);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        let totalAmount = 0;
        cart.products.forEach(item => {
            if (item.product && item.product.price) {
                totalAmount += item.product.price * item.quantity;
            }
        });

        res.render('cart', {
            cart,
            totalAmount,
            user: req.session.user,
            style: 'style.css'
        });
    } catch (error) {
        console.error('Error al renderizar la vista del carrito:', error);
        res.status(500).send('Error al renderizar la vista del carrito');
    }
});

// Ruta para la vista de todos los tickets (admin)
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.render('tickets', 
            { style: 'style.css',
              tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Tickets', error });
    }
});

// Ruta para mostrar el ticket de la compra (cliente)
// Ruta para mostrar un ticket individual
router.get('/ticket/:tid', isUserOrPremium, async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const ticket = await ticketService.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).send('Ticket no encontrado');
        }

        res.render('ticket', {
            ticket,
            user: req.session.user,
            style: 'style.css'
        });
    } catch (error) {
        console.error('Error al renderizar la vista del ticket:', error);
        res.status(500).send('Error al renderizar la vista del ticket');
    }
});

router.get('/reset-password-expired', (req, res) => {
    res.render('passwordResetExpired', {
        title: 'Token Expirado',
        style: 'style.css'
    });
});

// Ruta para la vista de usuarios
router.get('/users', isAdmin, getAllUsers, (req, res) => {
    res.render('users', {
        users: res.locals.users,
        style: 'style.css',
    });
});

//Ruta para la carga de documentos para hacerse Premium
router.get('/uploadDocuments', isUserOrPremium, (req, res) => {
    res.render('uploadDocuments', 
        {
        userId: req.session.user.id,
        title: 'Completar documentación para hacerse Premium',
        style: 'style.css'
    });
});

export default router;