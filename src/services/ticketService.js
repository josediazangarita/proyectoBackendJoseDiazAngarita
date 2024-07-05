import TicketMongo from '../dao/mongoDB/ticketMongo.js';

class TicketService {
    constructor() {
        this.ticketMongo = new TicketMongo();
    }

    async createTicket(ticketData) {
        console.log('Creando ticket:', ticketData);
        return await this.ticketMongo.create(ticketData);
    }

    async getAllTickets() {
        return await this.ticketMongo.findAll();
    }

    async getTicketById(id) {
        return await this.ticketMongo.findById(id);
    }

    async updateTicket(id, ticketData) {
        return await this.ticketMongo.update(id, ticketData);
    }

    async deleteTicket(id) {
        return await this.ticketMongo.delete(id);
    }
}

export default TicketService;