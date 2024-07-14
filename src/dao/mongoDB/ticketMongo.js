import Ticket from '../../models/ticketModel.js';

class TicketMongo {
    async create(ticketData) {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return ticket;
    }

    async findAll() {
        return await Ticket.find();
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId).lean();
            return ticket;
        } catch (error) {
            console.error(`Error en getTicketById: ${error.message}`);
            throw new Error(error.message);
        }
    }

    async update(id, ticketData) {
        return await Ticket.findByIdAndUpdate(id, ticketData, { new: true });
    }

    async delete(id) {
        return await Ticket.findByIdAndDelete(id);
    }
}

export default TicketMongo;