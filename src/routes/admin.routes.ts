import express from 'express';
import { createVendor, getAllVendors, getVendorById } from '../controllers';



export const adminRouter = express.Router();


adminRouter.post('/admin/create-vendor', createVendor);
adminRouter.get('/admin/getVendors', getAllVendors)
adminRouter.get('/admin/getVendors/:id', getVendorById)