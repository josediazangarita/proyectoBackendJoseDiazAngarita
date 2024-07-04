import TicketService from '../services/ticketService.js';
import TicketDTO from '../dto/ticketDTO.js';

class TicketController {
    constructor() {
        this.ticketService = new TicketService();
    }

    createTicket = async (req, res) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.createTicket({ amount, purchaser });
            const ticketDTO = new TicketDTO(ticket);
            res.status(201).json(ticketDTO);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el Ticket', error });
        }
    };

    getAllTickets = async (req, res) => {
        try {
            const tickets = await this.ticketService.getAllTickets();
            const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));
            res.status(200).json(ticketDTOs);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los Tickets', error });
        }
    };

    updateTicket = async (req, res) => {
        try {
            const { amount, purchaser } = req.body;
            const ticket = await this.ticketService.updateTicket(req.params.id, { amount, purchaser, updatedAt: Date.now() });
            const ticketDTO = new TicketDTO(ticket);
            res.status(200).json(ticketDTO);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el Ticket', error });
        }
    };

    deleteTicket = async (req, res) => {
        try {
            await this.ticketService.deleteTicket(req.params.id);
            res.status(200).json({ message: 'Ticket eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el Ticket', error });
        }
    };
}

export default TicketController;
