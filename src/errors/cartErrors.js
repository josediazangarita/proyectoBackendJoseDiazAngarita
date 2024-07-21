import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateCartErrorInfo } from './generateCartErrorInfo.js';

export class CartNotFoundError extends CustomError {
    constructor(cartId) {
        super('CartNotFoundError', `The cart with ID ${cartId} was not found`, `The cart with ID ${cartId} does not exist`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidCartError extends CustomError {
    constructor(cart) {
        super('InvalidCartError', generateCartErrorInfo(cart), 'Invalid cart data', EErrors.VALIDATION_ERROR);
    }
}

export class CartDatabaseError extends CustomError {
    constructor(cause) {
        super('CartDatabaseError', cause, 'An error occurred while retrieving or interacting with the cart in the database', EErrors.DATABASE_ERROR);
    }
}