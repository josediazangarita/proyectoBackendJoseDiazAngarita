import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateUserErrorInfo } from '../errors/generateUserErrorInfo.js';

export class UserNotFoundError extends CustomError {
    constructor(email) {
        super('UserNotFoundError', `The user with email: ${email} was not found`, `The user with email: ${email} does not exist`, EErrors.ROUTING_ERROR, 'User not found');
    }
}

export class InvalidUserError extends CustomError {
    constructor(user) {
        const details = generateUserErrorInfo(user);
        super('InvalidUserError', details, 'Invalid user data', EErrors.VALIDATION_ERROR, 'Invalid user information. Please check the details and try again.');
    }
}

export class AuthenticationError extends CustomError {
    constructor(details) {
        super('AuthenticationError', details, 'Authentication failed. Invalid username or password', EErrors.AUTHENTICATION_ERROR, 'Invalid email or password. Please try again.');
    }
}

export class UnderageUserError extends CustomError {
    constructor(age) {
        super('UnderageUserError', `User is ${age} years old, which is under the allowed age limit`, 'Registration of users under 18 years old is not allowed', 400);
    }
}