import { expect } from 'chai';
import mongoose from 'mongoose';
import CartMongo from '../../src/dao/mongoDB/cartMongo.js';
import ProductModel from '../../src/models/productModel.js';
import dotenv from 'dotenv';


dotenv.config();
const mongoUri = process.env.MONGODB_URI_TEST;
const cartDao = new CartMongo();

const testProduct = new ProductModel({
  title: 'Producto de prueba',
  description: 'Descripción producto test',
  code: '001',
  price: 100,
  stock: 100,
  category: 'PC',
  owner: 'premium'
});

describe('Tests DAO Carts Chai', function () {
    before(async function () {
        await mongoose.connect(mongoUri);
        await mongoose.connection.db.collection('carts').deleteMany({});
        await testProduct.save();
    });

    beforeEach(async function () {
        this.timeout(3000);
        await cartDao.createCart();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    afterEach(async function () {
        await mongoose.connection.db.collection('carts').deleteMany({});
    });

    it('createCart() debe retornar un objeto con los datos del nuevo carrito', async function () {
        const result = await cartDao.createCart();
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
    });

    it('getAllCarts() debe retornar un array de carritos', async function () {
        const result = await cartDao.getAllCarts();
        expect(result).to.be.an('array');
    });

    it('getCartById() debe retornar un objeto coincidente con el id del carrito', async function () {
        const cart = await cartDao.createCart();
        const result = await cartDao.getCartById(cart._id);
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
    });

    it('addProductToCart() debe agregar un producto al carrito', async function () {
        const cart = await cartDao.createCart();
        const result = await cartDao.addProductToCart(cart._id, testProduct._id, 2);
        expect(result).to.be.an('object');
        expect(result.products[0].product.toString()).to.equal(testProduct._id.toString());
        expect(result.products[0].quantity).to.equal(2);
    });

    it('removeProductFromCart() debe eliminar un producto del carrito', async function () {
        const cart = await cartDao.createCart();
        await cartDao.addProductToCart(cart._id, testProduct._id, 2);
        const result = await cartDao.removeProductFromCart(cart._id, testProduct._id);
        expect(result).to.be.an('object');
        expect(result.products).to.be.an('array').that.is.empty;
    });

    it('updateCart() debe actualizar los productos del carrito', async function () {
        const cart = await cartDao.createCart();
        const products = [{ product: testProduct._id, quantity: 3 }];
        const result = await cartDao.updateCart(cart._id, products);
        expect(result).to.be.an('object');
        expect(result.products[0].quantity).to.equal(3);
    });

    it('clearCart() debe vaciar el carrito', async function () {
        const cart = await cartDao.createCart();
        await cartDao.addProductToCart(cart._id, testProduct._id, 2);
        const result = await cartDao.clearCart(cart._id);
        expect(result).to.be.an('object');
        expect(result.products).to.be.an('array').that.is.empty;
    });
});