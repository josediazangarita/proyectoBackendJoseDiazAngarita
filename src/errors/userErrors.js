import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateUserErrorInfo } from '../errors/generateUserErrorInfo.js';

export class UserNotFoundError extends CustomError {
    constructor(email) {
        super('UserNotFoundError', `El usuario con el correo: ${email} no se encontró`, `El usuario con el correo: ${email} no existe`, EErrors.ROUTING_ERROR, 'Usuario no encontrado');
    }
}

export class InvalidUserError extends CustomError {
    constructor(user) {
        const details = generateUserErrorInfo(user);
        super('InvalidUserError', details, 'Datos de usuario inválidos', EErrors.VALIDATION_ERROR, 'Invalid user information. Please check the details and try again.');
    }
}

export class AuthenticationError extends CustomError {
    constructor(details) {
        super('AuthenticationError', details, 'Autenticación fallida. Usuario y/o contraseña inválidos', EErrors.AUTHENTICATION_ERROR, 'Invalid email or password. Please try again.');
    }
}

export class UnderageUserError extends CustomError {
    constructor(age) {
        super('UnderageUserError', `User is ${age} years old, which is under the allowed age limit`, 'No se permite el registro de usuarios menores de 18 años', 400);
    }
}