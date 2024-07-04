import express from 'express';
import Ticket from '../models/ticket.js';
import TicketDTO from '../dto/ticketDTO.js';

const router = express.Router();

// Crear un nuevo Ticket
router.post('/', async (req, res) => {
    try {
        const { amount, purchaser } = req.body;
        const ticket = new Ticket({ amount, purchaser });
        await ticket.save();
        const ticketDTO = new TicketDTO(ticket);
        res.status(201).json(ticketDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el Ticket', error });
    }
});

// Obtener todos los Tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));
        res.status(200).json(ticketDTOs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Tickets', error });
    }
});

// Actualizar un Ticket (por ejemplo, para cambiar la cantidad o el comprador)
router.put('/:id', async (req, res) => {
    try {
        const { amount, purchaser } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { amount, purchaser, updatedAt: Date.now() }, { new: true });
        const ticketDTO = new TicketDTO(ticket);
        res.status(200).json(ticketDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el Ticket', error });
    }
});

// Eliminar un Ticket
router.delete('/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ticket eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el Ticket', error });
    }
});

export default router;