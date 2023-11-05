import express from 'express';

import { isAuthenticated } from '../middlewares/isAuthenticated';
import { customerLogin, customerProfile, customerSignUp, customerVerify, editProfile, requestOtp, createOrder, getOrderById, getOrders, VerifyOffer, CreatePayment } from '../controllers';


export const customerRouter = express.Router();


customerRouter.post('/customer/sign-up', customerSignUp)
customerRouter.post('/customer/login', customerLogin)


customerRouter.use(isAuthenticated)
customerRouter.get('/customer/profile', customerProfile);
customerRouter.get('/customer/otp', requestOtp)
customerRouter.patch('/customer/profile', editProfile);
customerRouter.patch('/customer/verify', customerVerify)


customerRouter.post('/customer/create-order', createOrder);
customerRouter.get('/customer/get-orders', getOrders)
customerRouter.get('/customer/get-orders/:id', getOrderById)


//Apply Offers
customerRouter.get('/customer/offer/verify/:id', VerifyOffer);


//Payment
customerRouter.post('/customer/create-payment', CreatePayment);