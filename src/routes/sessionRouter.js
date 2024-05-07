import Router from 'express';

import auth from '../middlewares/auth.js';

const router = Router();

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

router.get('/login', auth, (req, res) => {
    res.send(`Login success ${req.session.user}!`);
});



router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) return res.send("Logout Success!");

        res.send({
            status: "Logout ERROR",
            body: error
        })
    })
});

export default router;