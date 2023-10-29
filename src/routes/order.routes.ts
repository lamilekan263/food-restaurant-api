import express from 'express';

import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createOrder, getOrderById, getOrders } from '../controllers';


export const orderRouter = express.Router();



orderRouter.use(isAuthenticated);
orderRouter.post('/customer/create-order', createOrder);
orderRouter.get('/customer/get-orders', getOrders)
orderRouter.get('/customer/get-orders/:id', getOrderById)
