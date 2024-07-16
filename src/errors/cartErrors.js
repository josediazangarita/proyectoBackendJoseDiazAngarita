import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateCartErrorInfo } from './generateCartErrorInfo.js';

export class CartNotFoundError extends CustomError {
    constructor(cartId) {
        super('CartNotFoundError', `El carrito con el ID ${cartId} no se encontró`, `El carrito con el ID ${cartId} no existe`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidCartError extends CustomError {
    constructor(cart) {
        super('InvalidCartError', generateCartErrorInfo(cart), 'Datos del carrito inválidos', EErrors.VALIDATION_ERROR);
    }
}

export class CartDatabaseError extends CustomError {
    constructor(cause) {
        super('CartDatabaseError', cause, 'Ocurrió un error al obtener o interactuar el carrito con la base de datos', EErrors.DATABASE_ERROR);
    }
}