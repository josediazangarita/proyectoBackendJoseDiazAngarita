import {Router} from 'express';
import {generateUser, generateProduct} from '../utils/fakerUtil.js'

const router = Router();

router.get('/mockingUsers', async(req,res)=>{
    let users = []
    for (let i=0;i<100;i++){
        users.push(generateUser())
    }
    res.send({status:"success",payload:users})
})

router.get('/mockingProducts', async(req,res)=>{
    let products = []
    for (let i=0;i<100;i++){
        products.push(generateProduct())
    }
    res.send({status:"success",payload:products})
})

export default router;