import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateProductErrorInfo } from './generateProductErrorInfo.js';

export class ProductNotFoundError extends CustomError {
    constructor(productId) {
        super('ProductNotFoundError', `The product with ID ${productId} was not found`, `The product with ID ${productId} does not exist`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidProductError extends CustomError {
    constructor(product) {
        super('InvalidProductError', generateProductErrorInfo(product), 'Invalid product data', EErrors.VALIDATION_ERROR);
    }
}

export class ProductDatabaseError extends CustomError {
    constructor(product, cause) {
        super('ProductDatabaseError', generateProductErrorInfo(product), cause, EErrors.DATABASE_ERROR);
    }
}