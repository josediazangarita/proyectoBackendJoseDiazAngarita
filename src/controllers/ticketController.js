import TicketService from '../services/ticketService.js';
import TicketDTO from '../dto/ticketDTO.js';
import { TicketNotFoundError, InvalidTicketError, TicketDatabaseError } from '../errors/ticketErrors.js';
import logger from '../logs/logger.js';

class TicketController {
    constructor() {
        this.ticketService = new TicketService();
    }

    createTicket = async (req, res, next) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.createTicket({ amount, purchaser });
            const ticketDTO = new TicketDTO(ticket);
            logger.info('Ticket created', { amount, purchaser });
            res.status(201).json(ticketDTO);
        } catch (error) {
            logger.error('Error creating ticket', { error: error.message, stack: error.stack });
            next(new InvalidTicketError(req.body));
        }
    };

    getAllTickets = async (req, res, next) => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));
            logger.info('Fetched all tickets');
            res.status(200).json(ticketDTOs);
        } catch (error) {
            logger.error('Error fetching tickets', { error: error.message, stack: error.stack });
            next(new TicketDatabaseError(error.message));
        }
    };

    updateTicket = async (req, res, next) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.updateTicket(req.params.id, { amount, purchaser, updatedAt: Date.now() });
            const ticketDTO = new TicketDTO(ticket);
            logger.info('Ticket updated', { ticketId: req.params.id, amount, purchaser });
            res.status(200).json(ticketDTO);
        } catch (error) {
            logger.error('Error updating ticket', { error: error.message, stack: error.stack });
            next(new InvalidTicketError(req.body));
        }
    };

    getTicketById = async (req, res, next) => {
        const { tid } = req.params;
        try {
            const ticket = await this.ticketService.getTicketById(tid);
            if (!ticket) {
                throw new TicketNotFoundError(tid);
            }
            logger.info('Fetched ticket by ID', { ticketId: tid });
            res.status(200).json(ticket);
        } catch (error) {
            logger.error('Error fetching ticket by ID', { error: error.message, stack: error.stack });
            next(error);
        }
    };

    deleteTicket = async (req, res, next) => {
        try {
            await this.ticketService.deleteTicket(req.params.id);
            logger.info('Ticket deleted', { ticketId: req.params.id });
            res.status(200).json({ message: 'Ticket deleted' });
        } catch (error) {
            logger.error('Error deleting ticket', { error: error.message, stack: error.stack });
            next(new InvalidTicketError(error.message));
        }
    };
}

export default TicketController;