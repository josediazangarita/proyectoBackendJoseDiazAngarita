import Router from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find()
        res.send({ resul: "seccess", payload: users })
    }
    catch (error) {
        console.log("No se pueden obtener usuarios con mongoose:" + error)
        res.status(500).send({ status: "error", message: error.message })
    }
});

export default router;