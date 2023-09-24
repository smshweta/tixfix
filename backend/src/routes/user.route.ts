import { Router } from 'express';
import userController from '../controller/user.controller';
import validateToken from '../middleware/validatetoken';
const userRouter = Router();
// specifies the endpoint and the method to call
userRouter.post('/', userController.createUser);
userRouter.post('/login', userController.authenticateUser);
userRouter.get('/logout', validateToken, userController.logout);
userRouter.get('/employees', validateToken, userController.getAllEmployees);
// export the router
export default userRouter;