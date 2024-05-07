import Router from 'express';

import userModel from '../dao/models/userModel.js';
/*import {createHash, isValidPassword} from '../utils/functionUtils.js';*/

const router = Router();

router.post('/register', async (req, res) => {
    console.log("Datos recibidos para registro:", req.body); 

    try {
        req.session.failRegister = false;
        await userModel.create(req.body);
        console.log("Usuario creado exitosamente"); 
        console.log("Estado de la sesión:", req.session);
        res.redirect("/login");

    } catch (e) {
        console.log("Error al registrar usuario:", e);
        req.session.failRegister = true;
        console.log("Estado de la sesión después del error:", req.session);
        res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    try{
        const result = await userModel.findOne({email: req.body.email});
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (req.body.password !== result.password) {
            res.session.failLogin = true;
            return res.redirect("/login");
        } 

        delete result.password;
        req.session.user = result;
        return res.redirect("/");
    
    } catch (e) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

export default router;