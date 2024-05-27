import Router from 'express';
import passport from 'passport';

import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionUtils.js';

const router = Router();

// Ruta para registrar un nuevo usuario con passport
router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister' }),
    (req, res) => {
        //res.send({ status: 'success', message: 'User registered successfully', user: req.user });
        res.redirect('/login');
    }
);

router.get('/failRegister', (req, res) => {
    res.status(400).send({
        status: 'Register error',
        message: 'Failed registering user'
    });
});

// Ruta para loguear a un usuario con passport
router.post(
    '/login',
    passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).send({
                status: 'error',
                message: 'Error login'
            });
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        };
        //res.send({ status: 'success', message: 'Login successful', user: req.session.user });
        res.redirect('/products');
    }
);

router.get('/failLogin', (req, res) => {
    res.status(400).send({
        status: 'Login error',
        message: 'Failed login'
    });
});

// Ruta para restaurar la contraseña de un usuario
router.post('/restorePassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).send("No se encontró el usuario con ese email.");
            return;
        }
        user.password = createHash(newPassword);
        await user.save();
        return res.redirect('/login');
    } catch (e) {
        console.error("Error al restaurar contraseña:", e);
        res.status(500).send("Error al actualizar la contraseña.");
    }
});

export default router;



/* //Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        req.session.failRegister = false;

        if (!req.body.email || !req.body.password) {
            throw new Error("Email and password are required.");
        }

        const newUser = {
            first_name: req.body.first_name ?? '',
            last_name: req.body.last_name ?? '',
            email: req.body.email,
            age: req.body.age ?? '',
            password: createHash(req.body.password),
        };

        await userModel.create(newUser);
        res.redirect("/login");

    } catch (e) {
        console.error("Error al registrar usuario:", e);
        req.session.failRegister = true;
        res.redirect("/register");
    }
}); */


/*router.post("/login", async (req, res) => {
    try{
        const result = await userModel.findOne({email: req.body.email});
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (req.body.password !== result.password) {
            req.session.failLogin = true;
            return res.redirect("/login");
        } 

        delete result.password;
        req.session.user = result;
        return res.redirect("/products");
    
    } catch (e) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});*/

/* //Ruta para loguear a un usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (!isValidPassword(user, req.body.password)) {
            req.session.failLogin = true;
            return res.redirect("/login");

            // if (password !== user.password) {
            //req.session.failLogin = true;
            //return res.redirect("/login");
        }

        // Asignar rol de admin si el correo y la contraseña coinciden con los del administrador
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'usuario';
        }

        // Guardar el rol en la sesión
        req.session.user = user.toObject();
        delete req.session.user.password;
        req.session.user.role = user.role;

        delete user.password;
        req.session.user = user;

        return res.redirect("/products");
    } catch (e) {
        console.error("Error de login:", e);
        req.session.failLogin = true;
        return res.redirect("/login");
    }
}); */