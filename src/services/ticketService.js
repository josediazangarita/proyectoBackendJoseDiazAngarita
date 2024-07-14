import TicketMongo from '../dao/mongoDB/ticketMongo.js';
import TicketDTO from '../dto/ticketDTO.js'

class TicketService {
    constructor() {
        this.ticketMongo = new TicketMongo();
    }

    async createTicket(ticketData) {
        const createdTicket = await this.ticketMongo.create(ticketData);
        console.log('Ticket creado en DB:', createdTicket);
        return new TicketDTO(createdTicket);
    }

    async getAllTickets() {
        return await this.ticketMongo.findAll();
    }

    async getTicketById(ticketId) {
        const ticket = await this.ticketMongo.getTicketById(ticketId);
        if (!ticket) throw new Error(`Ticket con id ${ticketId} no encontrado`);
        return new TicketDTO(ticket);
    }

    async updateTicket(id, ticketData) {
        return await this.ticketMongo.update(id, ticketData);
    }

    async deleteTicket(id) {
        return await this.ticketMongo.delete(id);
    }
}

export default TicketService;