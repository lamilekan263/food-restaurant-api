import express, { Request, Response, NextFunction } from 'express';
import {
    DeliveryLogin,
    DeliverySignUp, EditDeliveryProfile, GetDeliveryProfile, UpdateDeliveryUserStatus
} from '../controllers';
import { isAuthenticated } from '../middlewares/isAuthenticated';



export const deliveryRouter = express.Router();

/* ------------------- Signup / Create Customer --------------------- */
deliveryRouter.post('/signup', DeliverySignUp)

/* ------------------- Login --------------------- */
deliveryRouter.post('/login', DeliveryLogin)

/* ------------------- Authentication --------------------- */
deliveryRouter.use(isAuthenticated);

/* ------------------- Change Service Status --------------------- */
deliveryRouter.put('/delivery/change-status', UpdateDeliveryUserStatus);

/* ------------------- Profile --------------------- */
deliveryRouter.get('/profile', GetDeliveryProfile)
deliveryRouter.patch('/profile', EditDeliveryProfile)