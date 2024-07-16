import CustomError from '../errors/customErrors.js';
import EErrors from '../errors/EErrors.js';
import { generateTicketErrorInfo } from './generateTicketErrorInfo.js';

export class TicketNotFoundError extends CustomError {
    constructor(ticketId) {
        super('TicketNotFoundError', `El ticket con el ID ${ticketId} no se encontró`, `El ticket con el ID ${ticketId} no existe`, EErrors.ROUTING_ERROR);
    }
}

export class InvalidTicketError extends CustomError {
    constructor(ticket) {
        super('InvalidTicketError', generateTicketErrorInfo(ticket), 'Datos de ticket inválidos', EErrors.VALIDATION_ERROR);
    }
}

export class TicketDatabaseError extends CustomError {
    constructor(cause) {
        super('TicketDatabaseError', cause, 'Ocurrió un error con el ticket en la base de datos', EErrors.DATABASE_ERROR);
    }
}