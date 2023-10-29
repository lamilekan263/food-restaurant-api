import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { ICreateOrderBodyInput } from "../dto";
import { customerModel, foodModel, orderModel } from "../models";

// order


export const createOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const profile = await customerModel.findOne({ email: user?.email });
        if (!profile) {
            return next(new ErrorHandler('customer does not exist', 400))
        }
        const cart = req.body as [ICreateOrderBodyInput];

        const foods = await foodModel.find().where('_id').in(cart.map(item => item._id)).exec();
        const cartItems = new Array;
        let netAmount = 0.0;
        const orderId = Math.floor(1000 + Math.random() * 89000);

        foods.map(food => cart.map(({ _id, unit }) => {
            if (food._id == _id) {
                netAmount += food.price * unit;
                cartItems.push({ food, unit })
            }
        }))

        const createOrder = await orderModel.create({
            orderId: orderId,
            vendorId: "",
            items: cartItems,
            totalAmount: netAmount,
            orderDate: Date.now(),
            paidThrough: "COD",
            paymentResponse: "",
            orderStatus: "waiting",
            // remarks: string,
            // deliveryId: string,
            // appliedOffers: boolean,
            // offerId: string,
            // readyTime: number

        })

        profile.orders.push(createOrder)
        await profile.save()
        return res.status(200).json({
            success: true,
            createOrder
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});


export const getOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const profile = await customerModel.findOne({ email: user?.email }).populate('orders');
        if (!profile) {
            return next(new ErrorHandler('customer does not exist', 400))
        }

        return res.status(200).json({
            success: true,
            orders: profile.orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});


export const getOrderById = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id;

        const order = await orderModel.findById(id).populate('items.food');
        if (!order) {
            return next(new ErrorHandler('Order Not found', 404))
        }
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});
