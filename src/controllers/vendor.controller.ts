import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";

import { IVendorLoginBody, IVendorUpdateProfileBody } from "../dto";
import vendorModel from "../models/vendor.model";

import { createFoodInput } from "../dto/Food.dto";
import { foodModel } from "../models/food.model";
import ErrorHandler from "../utils/ErrorHandler";
import { createToken } from "../utils/jwt";
import { orderModel } from "../models";


export const loginVendor = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body as IVendorLoginBody;

        if (!email || !password) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }

        const user = await vendorModel.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 400));
        };

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }
        const token = createToken(user)
        return res.status(201).json({
            success: true,
            token
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const profile = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.user?.email;

        const userExist = await vendorModel.findOne({ email });

        if (!userExist) {
            return next(new ErrorHandler('not exist', 404))
        }

        res.status(200).json({
            success: true,
            user: userExist
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const updateCoverImages = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log(req.files)
        const user = req.user;

        const userExist = await vendorModel.findOne({ email: user?.email });

        if (!userExist) {
            return next(new ErrorHandler('user does not exist', 400))
        }

        const files = req.files as [Express.Multer.File];

        const uploadedFiles = files.map((file: Express.Multer.File) => file.originalname);

        userExist.coverImages.push(...uploadedFiles);

        const saved = await userExist.save();

        return res.status(200).json({
            success: true,
            saved
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const updateProfile = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, address, phone, foodTypes } = req.body as IVendorUpdateProfileBody;
        const userEmail = req.user?.email;

        const vendor = await vendorModel.findOne({ email: userEmail });

        if (!vendor) {
            return next(new ErrorHandler('vendor does not exist', 404));
        }

        vendor.name = name;
        vendor.address = address;
        vendor.phone = phone;
        vendor.foodTypes = foodTypes

        const saved = await vendor.save();

        return res.status(201).json({
            success: true,
            vendor: saved
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const updateService = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.user?.email;

        const userExist = await vendorModel.findOne({ email });

        if (!userExist) {
            return next(new ErrorHandler('not exist', 404))
        }

        userExist.serviceAvailable = !userExist.serviceAvailable;
        const savedUser = await userExist.save();

        res.status(200).json({
            success: true,
            user: savedUser
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const addFood = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name,
            description,
            category,
            foodType,
            readyTime,
            price } = req.body as createFoodInput

        const user = req.user

        const userExist = await vendorModel.findOne({ email: user?.email });

        if (!userExist) {
            return next(new ErrorHandler('this vendor does not exist', 400))
        };
        const uploadedFiles = req.files as [Express.Multer.File];

        const imageFiles = uploadedFiles.map((file: Express.Multer.File) => file.originalname);

        const food = await foodModel.create({
            vendorId: userExist._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            images: imageFiles
        })

        userExist.foods.push(food);
        const saved = await userExist.save();

        return res.status(200).json({
            success: true,
            saved
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getFood = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const food = await foodModel.find({});

        return res.status(200).json({
            success: true,
            food
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

// orders

export const getCurrentOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const isExist = await vendorModel.findOne({ email: user?.email });
        if (!isExist) {
            return next(new ErrorHandler('Not found', 400))
        }

        const orders = await orderModel.find({ vendorId: isExist._id }).populate('items.food');

        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getOrderDetails = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (id) {
            const order = await orderModel.findById(id).populate('items.food');


            return res.status(200).json({
                success: true,
                order
            })
        }
        return next(new ErrorHandler('Order not found', 404))
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const processOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, remarks, time } = req.body;

        if (id) {
            const order = await orderModel.findById(id).populate('food');
            if (order) {
                order.orderStatus = status;
                order.remarks = remarks;
                if (time) {
                    order.readyTime = time
                }

                const orderResult = await order.save();

                if (orderResult !== null) {
                    return res.status(200).json({
                        success: true,
                        order: orderResult
                    })
                }
            }
        }

        return next(new ErrorHandler('Unable to process order', 404))
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})