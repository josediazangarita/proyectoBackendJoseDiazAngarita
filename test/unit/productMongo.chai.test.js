import { expect } from 'chai';
import mongoose from 'mongoose';
import ProductMongo from '../../src/dao/mongoDB/productMongo.js';
import dotenv from 'dotenv';


dotenv.config();
const mongoUri = process.env.MONGODB_URI_TEST;
const dao = new ProductMongo();

const testProduct = {
  title: 'Producto de prueba',
  description: 'Descripción producto de prueba',
  code: '001',
  price: 100,
  stock: 100,
  category: 'PC',
  owner: 'premium',
  status: true, 
  thumbnails: ['thumbnail1.jpg']
};

describe('Tests DAO Products Chai', function () {
    // Se ejecuta ANTES de comenzar el paquete de tests
    before(async function () {
        await mongoose.connect(mongoUri);
        await mongoose.connection.db.collection('products').deleteMany({});
    });

    // Se ejecuta ANTES de CADA test
    beforeEach(async function () {
        this.timeout(3000);
        // Añadiendo un producto de prueba antes de cada test
        const result = await dao.addProduct(testProduct);
        testProduct._id = result._id; // Guardar el _id del producto para usar en otros tests
    });

    // Se ejecuta FINALIZADO el paquete de tests
    after(async function () {
        await mongoose.connection.close();
    });

    // Se ejecuta FINALIZADO CADA test
    afterEach(async function () {
        await mongoose.connection.db.collection('products').deleteMany({});
    });

    // Lista de tests
    it('getProducts() debe retornar un array de productos', async function () {
        const result = await dao.getProducts();
        console.log('Resultado de getProducts:', result);
        expect(result).to.be.an('array');
        expect(result.some(product => product._id.equals(testProduct._id))).to.be.true;
    });

    it('getProducts() debería retornar un array vacío si no hay productos', async function () {
        await mongoose.connection.db.collection('products').deleteMany({});
        const result = await dao.getProducts();
        expect(result).to.be.an('array').that.is.empty;
    });

    it('addProduct() debe retornar un objeto con los datos del nuevo producto', async function () {
        const newProduct = {
            title: 'Nuevo Producto',
            description: 'Descripción nuevo producto',
            code: '002',
            price: 200,
            stock: 50,
            category: 'Laptops',
            owner: 'admin',
            status: true,
            thumbnails: ['thumbnail2.jpg']
        };

        const result = await dao.addProduct(newProduct);
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.title).to.equal(newProduct.title);
    });

    it('addProduct() debería fallar si falta un campo obligatorio', async function () {
        try {
            await dao.addProduct({
                description: 'Producto sin título',
                code: '003',
                price: 100,
                stock: 50,
                category: 'PC',
                owner: 'admin',
                status: true,
                thumbnails: ['thumbnail3.jpg']
            });
            expect.fail('Debería lanzar un error debido a la falta de un campo obligatorio');
        } catch (error) {
            expect(error.message).to.include('validation failed');
        }
    });

    it('addProduct() debería fallar si el código ya existe', async function () {
        try {
            await dao.addProduct(testProduct);
            await dao.addProduct(testProduct);
            expect.fail('Debería lanzar un error debido al código duplicado');
        } catch (error) {
            expect(error.message).to.include('duplicate key error');
        }
    });

    it('getProductById() debe retornar un objeto coincidente con el id del producto', async function () {
        const result = await dao.getProductById(testProduct._id);
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.title).to.equal(testProduct.title);
    });

    it('getProductById() debería retornar null si el ID no existe', async function () {
        const result = await dao.getProductById(new mongoose.Types.ObjectId());
        expect(result).to.be.null;
    });

    it('updateProduct() debe retornar un objeto con datos correctamente modificados', async function () {
        const modifiedData = { price: 150 };
        const result = await dao.updateProduct(testProduct._id, modifiedData);
        console.log('Resultado de updateProduct:', result);
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.price).to.equal(modifiedData.price);
    });    
    
    it('deleteProduct() debe borrar el producto con el id indicado', async function () {
        const result = await dao.deleteProduct(testProduct._id);
        expect(result).to.be.true;
        const deletedProduct = await dao.getProductById(testProduct._id);
        expect(deletedProduct).to.be.null;
    });

    it('deleteProduct() debería retornar false si el producto no existe', async function () {
        const result = await dao.deleteProduct(new mongoose.Types.ObjectId());
        expect(result).to.be.false;
    });
});