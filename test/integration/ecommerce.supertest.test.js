import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoUri = process.env.MONGODB_URI_TEST;
const requester = supertest('http://localhost:8080');

const adminUser = { 
    first_name: 'Admin', 
    last_name: 'User', 
    email: 'admin@coder.com', 
    age: 30, 
    password: 'adminpass', 
    role: 'admin' 
};
const testUser = { 
    first_name: 'José', 
    last_name: 'Díaz', 
    email: 'jgda@gmail.com', 
    age: 20, 
    role: "user",
    password: '12345' 
};
const testProduct = { 
    title: 'Nuevo Producto',
    description: 'Descripción nuevo producto',
    code: '001',
    price: 200,
    stock: 50,
    category: 'Xbox',
    owner: 'admin',
    status: true,
    thumbnails: ['thumbnail2.jpg'] 
};

describe('Test de Integración Ecommerce', function () {
    
    before(async function () {
        // Conectar a la base de datos y limpiar colecciones
        await mongoose.connect(mongoUri, {});
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.connection.db.collection('products').deleteMany({});
        await mongoose.connection.db.collection('carts').deleteMany({});
        
        // Registrar el usuario administrador
        const adminResponse = await requester.post('/api/users/register').send(adminUser);
        expect(adminResponse.statusCode).to.equal(302);

        // Login del usuario administrador para obtener el token
        const loginResponse = await requester.post('/api/users/login').send({
            email: adminUser.email,
            password: adminUser.password
        });
        expect(loginResponse.statusCode).to.equal(302);
        const cookie = loginResponse.headers['set-cookie'][0];
        
        // Agregar un producto usando el token de administrador
        const productResponse = await requester.post('/api/products')
            .set('Cookie', cookie) // Usar la cookie de sesión del administrador
            .send(testProduct);
        expect(productResponse.statusCode).to.equal(200);

        this.productId = productResponse.body.payload._id; // Guarda el ID del producto para usarlo en los tests
        //this.productStock = productResponse.body.payload.stock;
        //console.log('ID del producto:', this.productId, 'Stock del producto:', this.productStock); // Guarda el Stock del producto para usarlo en los tests
    });

    after(async function () {
        // Limpiar colecciones al finalizar los test
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.connection.db.collection('products').deleteMany({});
        await mongoose.connection.db.collection('carts').deleteMany({});
        
        // Cierra la conexión de la base de datos al finalizar los tests
        await mongoose.connection.close();
    });

    // Lista de tests

    it('POST /api/users/register debe registrar correctamente un usuario', async function () {
        const { statusCode } = await requester.post('/api/users/register').send(testUser);

        expect(statusCode).to.equal(302); // Verifica que el statusCode sea 302 para redirección

        // Consulta en la base de datos para verificar que el usuario ha sido creado
        const user = await mongoose.connection.db.collection('users').findOne({ email: testUser.email });
        expect(user).to.not.be.null;
        expect(user).to.have.property('email', testUser.email);
    });

    it('POST /api/users/login debe autenticar correctamente un usuario registrado', async function () {
        const { statusCode, headers } = await requester.post('/api/users/login').send({
            email: testUser.email,
            password: testUser.password
        });

        expect(statusCode).to.equal(302);

        // Guarda la cookie para usar en los siguientes tests
        this.cookie = headers['set-cookie'][0];

        // Consulta en la base de datos para obtener el cartId del usuario
        const user = await mongoose.connection.db.collection('users').findOne({ email: testUser.email });
        expect(user).to.not.be.null;

        // Guarda el cartId para utilizarlo en otros tests
        this.cartId = user.cart;
    });

    it('POST /api/carts/:cid/products/:pid debe agregar un producto al carrito', async function () {
        const { cartId, productId, cookie } = this;

        // Verifica que el cartId y el productId existan
        expect(cartId).to.exist;
        expect(productId).to.exist;

        //console.log(`Agregando producto con ID: ${productId} al carrito con ID: ${cartId}`);

        // Realiza la petición para agregar el producto al carrito
        const addProductResponse = await requester.post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', cookie) // Usar la cookie del login del usuario
            .send();
    
        // Verifica que la petición fue exitosa
        expect(addProductResponse.statusCode).to.equal(200);

        // Recupera el carrito del usuario para verificar la adición del producto
        const { body: cart } = await requester.get(`/api/carts/${cartId}`)
            .set('Cookie', cookie); // Usar la cookie del login del usuario

        // Verifica si el carrito contiene el producto agregado
        const productInCart = cart.products.some(p => p.product._id.toString() === productId);
        expect(productInCart).to.be.true;

         // Vaciar el carrito antes de agregar el producto
        const emptyCartResponse = await requester.delete(`/api/carts/${cartId}`)
        .set('Cookie', cookie);
        expect(emptyCartResponse.statusCode).to.equal(200);

        // Verificar que el carrito esté vacío
        const { body: emptyCart } = await requester.get(`/api/carts/${cartId}`)
        .set('Cookie', cookie);
        expect(emptyCart.products).to.be.empty;
    });  
    
    it('POST /api/carts/:cid/purchase debe completar la compra correctamente y generar un ticket de compra', async function () {
        const { cartId, cookie, productId } = this;
    
        expect(cartId).to.exist;
        expect(productId).to.exist;
    
        // Obtener el stock inicial del producto
        const initialProductResponse = await requester.get(`/api/products/${productId}`)
            .set('Cookie', cookie);
        expect(initialProductResponse.statusCode).to.equal(200);
        const initialProduct = initialProductResponse.body.payload;
        const initialStock = initialProduct.stock;
    
        // Agregar el producto al carrito con una cantidad específica
        const addProductResponse = await requester.post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', cookie)
            .send({ quantity: 5 });
        expect(addProductResponse.statusCode).to.equal(200);
    
        // Completar la compra
        const purchaseResponse = await requester.post(`/api/carts/${cartId}/purchase`)
            .set('Cookie', cookie)
            .send();
        expect(purchaseResponse.statusCode).to.equal(200);
    
        const { body: result } = purchaseResponse;
    
        // Verifica que el ticket ha sido creado correctamente
        expect(result).to.have.property('ticket');
        expect(result.ticket).to.have.property('code');
        expect(result.ticket).to.have.property('purchaseDatetime');
        expect(result.ticket).to.have.property('amount');
        expect(result.ticket).to.have.property('purchaser');
    
        // Verifica que el carrito esté vacío después de la compra
        const { body: cart } = await requester.get(`/api/carts/${cartId}`)
            .set('Cookie', cookie);
        expect(cart.products).to.be.empty;
    
        // Verifica el stock del producto después de la compra
        const updatedProductResponse = await requester.get(`/api/products/${productId}`)
            .set('Cookie', cookie);
        expect(updatedProductResponse.statusCode).to.equal(200);
        const updatedProduct = updatedProductResponse.body.payload;
    
        // Verifica que el stock del producto haya disminuido correctamente
        expect(updatedProduct.stock).to.equal(initialStock - 5);
    });    
    
})