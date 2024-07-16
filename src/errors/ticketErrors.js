import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateTicketErrorInfo } from './generateTicketErrorInfo.js';

export class TicketNotFoundError extends CustomError {
    constructor(ticketId) {
        super('TicketNotFoundError', `Ticket with ID ${ticketId} not found`, `Ticket with ID ${ticketId} does not exist`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidTicketError extends CustomError {
    constructor(ticket) {
        super('InvalidTicketError', generateTicketErrorInfo(ticket), 'Invalid ticket data', EErrors.VALIDATION_ERROR);
    }
}

export class TicketDatabaseError extends CustomError {
    constructor(cause) {
        super('TicketDatabaseError', cause, 'An error occurred while interacting with the ticket database', EErrors.DATABASE_ERROR);
    }
}