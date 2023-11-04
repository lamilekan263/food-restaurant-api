import express from 'express';
import { addToCart, deleteCart, getCart } from '../controllers';



export const cartRouter = express.Router();


cartRouter.get('/customer/get-cart', getCart)
cartRouter.post('/customer/add-to-cart', addToCart)
cartRouter.delete('/customer/delete-cart', deleteCart)

