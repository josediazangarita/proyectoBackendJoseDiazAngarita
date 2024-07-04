import Router from 'express';
import passport from 'passport';
// Import custom modules
import auth from '../middlewares/auth.js';
import { logoutUser } from '../controllers/userController.js';
import UserDTO from '../dto/userDTO.js'

const router = Router();

// Ruta para mostrar detalles de la sesión
router.get('/', (req, res) => {
    let username = req.session.user ? req.session.user : '';

    if (req.session.counter) {
        req.session.counter++;
        res.send(`${username} Visitaste el sitio: ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send('Bienvenido al Ecommerce de JGDA!');
    }
});

// Ruta para mostrar éxito de login
router.get('/login', auth, (req, res) => {
    res.send(`Login success ${req.session.user}!`);
});

// Ruta para cerrar sesión
router.post('/logout', logoutUser);

// Inicio de sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login', session: true }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/products');
    }
);

// Obtener usuario actual
router.get('/current', auth, (req, res) => {
    console.log("Datos de usuario en la sesión:", req.session.user);

    if (req.session.user) {
        // Crear un nuevo UserDTO con los datos del usuario de la sesión
        const userData = new UserDTO({
            first_name: req.session.user.firstName,
            last_name: req.session.user.lastName,
            email: req.session.user.email,
            //age: req.session.user.age,
            role: req.session.user.role,
        });
        console.log(userData);

        res.status(200).send({
            status: 'success',
            user: userData
        });
    } else {
        res.status(401).send({
            status: 'fail',
            message: 'No user session found'
        });
    }
});

export default router;