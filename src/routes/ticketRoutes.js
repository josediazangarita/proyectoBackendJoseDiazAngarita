import express from 'express';
import TicketController from '../controllers/ticketController.js';
//import {isAdmin} from '../middlewares/authorization.js'

const router = express.Router();
const ticketController = new TicketController();

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

export default router;