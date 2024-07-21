import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateTicketErrorInfo } from './generateTicketErrorInfo.js';

export class TicketNotFoundError extends CustomError {
    constructor(ticketId) {
        super('TicketNotFoundError', `The ticket with ID ${ticketId} was not found`, `The ticket with ID ${ticketId} does not exist`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidTicketError extends CustomError {
    constructor(ticket) {
        super('InvalidTicketError', generateTicketErrorInfo(ticket), 'Invalid ticket data', EErrors.VALIDATION_ERROR);
    }
}

export class TicketDatabaseError extends CustomError {
    constructor(cause) {
        super('TicketDatabaseError', cause, 'An error occurred with the ticket in the database', EErrors.DATABASE_ERROR);
    }
}
