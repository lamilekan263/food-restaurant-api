import express from 'express';
import { GetDeliveryUsers, GetTransactionById, GetTransactions, VerifyDeliveryUser, createVendor, getAllVendors, getVendorById } from '../controllers';



export const adminRouter = express.Router();


adminRouter.post('/admin/create-vendor', createVendor);
adminRouter.get('/admin/getVendors', getAllVendors)
adminRouter.get('/admin/getVendors/:id', getVendorById)


adminRouter.get('/admin/transactions', GetTransactions)
adminRouter.get('/transaction/:id', GetTransactionById)

adminRouter.put('/admin/delivery/verify', VerifyDeliveryUser)
adminRouter.get('/admin/delivery/users', GetDeliveryUsers);
