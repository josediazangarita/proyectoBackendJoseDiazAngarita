import Router from 'express';

import userModel from '../dao/models/userModel.js';
/*import {createHash, isValidPassword} from '../utils/functionUtils.js';*/

const router = Router();

//Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        req.session.failRegister = false;
        await userModel.create(req.body);
        res.redirect("/login");

    } catch (e) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

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

//Ruta para loguear a un usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (password !== user.password) {
            req.session.failLogin = true;
            return res.redirect("/login");
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

        return res.redirect("/products");
    } catch (e) {
        console.error("Error de login:", e);
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});


export default router;