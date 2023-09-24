import { Router } from 'express';
import ticketRouter from './ticket.route';
import userRouter from './user.route';
const routes = Router();
// define the base path and the router that's going to be called
routes.use('/tickets', ticketRouter);
routes.use('/users', userRouter);
// export the route
export default routes;