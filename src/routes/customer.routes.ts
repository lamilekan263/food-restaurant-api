import express from 'express';
import { customerLogin, customerProfile, customerSignUp, customerVerify, editProfile, requestOtp } from '../controllers/customer.controller';
import { profile } from '../controllers';
import { isAuthenticated } from '../middlewares/isAuthenticated';

export const customerRouter = express.Router();


customerRouter.post('/customer/sign-up', customerSignUp)
customerRouter.post('/customer/login', customerLogin)


customerRouter.use(isAuthenticated)
customerRouter.get('/customer/profile', customerProfile);
customerRouter.get('/customer/otp',requestOtp)
customerRouter.patch('/customer/profile', editProfile);
customerRouter.patch('/customer/verify', customerVerify)
