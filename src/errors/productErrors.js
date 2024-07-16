import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateProductErrorInfo } from './generateProductErrorInfo.js';

export class ProductNotFoundError extends CustomError {
    constructor(productId) {
        super('ProductNotFoundError', `El producto con el ID ${productId} no se encontró`, `El producto con el ID ${productId} no existe`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidProductError extends CustomError {
    constructor(product) {
        super('InvalidProductError', generateProductErrorInfo(product), 'Datos del producto inválidos', EErrors.VALIDATION_ERROR);
    }
}

export class ProductDatabaseError extends CustomError {
    constructor(product, cause) {
        super('ProductDatabaseError', generateProductErrorInfo(product), cause, EErrors.DATABASE_ERROR);
    }
}