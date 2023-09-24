import { Router } from 'express';
import ticketController from '../controller/ticket.controller';
import validateToken from '../middleware/validatetoken';
const ticketRouter = Router();
// specifies the endpoint and the method to call
ticketRouter.get('/', validateToken, ticketController.getAllTickets);
ticketRouter.post('/', validateToken, ticketController.createTicket);
ticketRouter.get('/:id', validateToken, ticketController.getTicketById);
ticketRouter.put('/:id/assignedto', validateToken, ticketController.updateTicketAssignedTo);
ticketRouter.put('/:id/status', validateToken, ticketController.updateTicketStatus);

// export the router
export default ticketRouter;