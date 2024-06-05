import Router from 'express';
import passport from 'passport';
// Import custom modules
import auth from '../middlewares/auth.js';
import { logoutUser } from '../controllers/userController.js';

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

// Obtener usuario actual
router.get('/current', auth, (req, res) => {
    res.status(200).send({
        status: 'success',
        user: req.session.user
    });
});

export default router;