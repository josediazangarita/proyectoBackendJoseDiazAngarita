import { expect } from 'chai';
import mongoose from 'mongoose';
import UserDAO from '../../src/dao/mongoDB/userMongo.js';

const userDao = new UserDAO();

const testUser = {
  email: 'jgda@gmail.com',
  password: '12345',
  name: 'JGDA User Test',
  age: 30,
  first_name: 'JGDA'
};

describe('Tests DAO Users Chai', function () {
    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Ecommerce_local');
        await mongoose.connection.db.collection('users').deleteMany({});
    });

    beforeEach(async function () {
        this.timeout(3000);
        await userDao.createUser(testUser);
    });

    after(async function () {
        await mongoose.connection.close();
    });

    afterEach(async function () {
        await mongoose.connection.db.collection('users').deleteMany({});
    });

    it('findUserByEmail() debe retornar un objeto con los datos del usuario cuando el usuario existe', async function () {
        const result = await userDao.findUserByEmail(testUser.email);
        expect(result).to.be.an('object');
        expect(result.email).to.equal(testUser.email);
    });

    it('findUserByEmail() debe retornar null cuando el usuario no existe', async function () {
        const result = await userDao.findUserByEmail('nonexistent@example.com');
        expect(result).to.be.null;
    });

    it('createUser() debe retornar un objeto con los datos del nuevo usuario', async function () {
        const newUser = {
            email: 'newuser@example.com',
            password: 'newpassword123',
            name: 'Nuevo Usuario',
            age: 18,
            first_name: 'Nuevo'
        };
        const result = await userDao.createUser(newUser);
        expect(result).to.be.an('object');
        expect(result.email).to.equal(newUser.email);
    });

    it('createUser() debe manejar errores cuando se intenta crear un usuario con un correo duplicado', async function () {
        try {
            await userDao.createUser(testUser);
            await userDao.createUser(testUser);
            expect.fail('Se esperaba un error debido a un correo duplicado');
        } catch (err) {
            expect(err).to.have.property('code', 11000);
        }
    });

    it('findUserByResetToken() debe retornar un objeto con el usuario cuando el token es válido', async function () {
        const token = 'validtoken';
        const expiration = Date.now() + 3600000;
        await userDao.updateUserPasswordResetToken(testUser.email, token, expiration);
        const result = await userDao.findUserByResetToken(token);
        expect(result.email).to.equal(testUser.email);
    });

    it('findUserByResetToken() debe retornar null cuando el token es inválido o expirado', async function () {
        const result = await userDao.findUserByResetToken('invalidtoken');
        expect(result).to.be.null;
    });

    it('updateUserPasswordResetToken() debe manejar el caso cuando el usuario no existe', async function () {
        const result = await userDao.updateUserPasswordResetToken('nonexistent@example.com', 'token', Date.now() + 3600000);
        expect(result).to.be.null;
    });

    it('updateUserPassword() debe actualizar la contraseña del usuario', async function () {
        const newPassword = 'newpassword123';
        await userDao.updateUserPassword(testUser.email, newPassword);
        const updatedUser = await userDao.findUserByEmail(testUser.email);
        expect(updatedUser.password).to.equal(newPassword);
    });

    it('updateUserPassword() debe manejar el caso cuando el usuario no existe', async function () {
        const result = await userDao.updateUserPassword('nonexistent@example.com', 'newpassword456');
        expect(result).to.be.null;
    });

    it('getUserById() debe retornar un objeto con los datos del usuario cuando el ID es válido', async function () {
        const user = await userDao.findUserByEmail(testUser.email);
        const result = await userDao.getUserById(user._id);
        expect(result.email).to.equal(testUser.email);
    });

    it('updateUser() debe actualizar los datos del usuario correctamente', async function () {
        const user = await userDao.findUserByEmail(testUser.email);
        const updatedData = { age: 42 };
        const result = await userDao.updateUser(user._id, updatedData);
        expect(result.age).to.equal(42);
    });

    it('getAllUsers() debe retornar un array de usuarios', async function () {
        const result = await userDao.getAllUsers();
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
    });
});