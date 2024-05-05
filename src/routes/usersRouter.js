import Router from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.get('/register', async (req, res) => {
    try {
        req.session.failRegister = false;
        await userModel.create(req.body);
        res.redirect("/login");

    } catch (e) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

router.get("/login", async (req, res) => {
    try{
        const result = await userModel.findOne({email: req.body.email});
        if (!result) {
            req.session.failLogin = true;
            res.redirect("/login");
        }

        if (req.body.password !== result.password) {
            res.session.failLogin = true;
            res.redirect("/login");
        } 

        delete result.password;
        req.session.user = result;
        res.redirect("/");
    
    } catch (e) {
        req.session.failLogin = true;
        redirect("/login");
    }
});

export default router;