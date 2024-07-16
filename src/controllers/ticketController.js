import TicketService from '../services/ticketService.js';
import TicketDTO from '../dto/ticketDTO.js';
import { TicketNotFoundError, InvalidTicketError, TicketDatabaseError } from '../errors/ticketErrors.js';

class TicketController {
    constructor() {
        this.ticketService = new TicketService();
    }

    createTicket = async (req, res, next) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.createTicket({ amount, purchaser });
            const ticketDTO = new TicketDTO(ticket);
            res.status(201).json(ticketDTO);
        } catch (error) {
            next(new InvalidTicketError(req.body));
        }
    };

    getAllTickets = async (req, res, next) => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));
            res.status(200).json(ticketDTOs);
        } catch (error) {
            next(new TicketDatabaseError(error.message));
        }
    };

    updateTicket = async (req, res, next) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.updateTicket(req.params.id, { amount, purchaser, updatedAt: Date.now() });
            const ticketDTO = new TicketDTO(ticket);
            res.status(200).json(ticketDTO);
        } catch (error) {
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
            res.status(200).json(ticket);
        } catch (error) {
            next(error);
        }
    };

    deleteTicket = async (req, res, next) => {
        try {
            await this.ticketService.deleteTicket(req.params.id);
            res.status(200).json({ message: 'Ticket eliminado' });
        } catch (error) {
            next(new InvalidTicketError(error.message));
        }
    };
}

export default TicketController;
