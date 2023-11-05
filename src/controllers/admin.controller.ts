import { Request, Response, NextFunction } from "express";

import { Ivendor } from "../dto";
import vendorModel from "../models/vendor.model";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { DeliveryUser, Transaction } from "../models";


export const createVendor = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name,
            ownerName,
            foodTypes,
            pinCode,
            address,
            phone,
            email,
            serviceAvailable,
            coverImages,
            rating,
            password } = req.body as Ivendor;

        const emailExist = await vendorModel.findOne({ email });
        if (emailExist) {
            return next(new ErrorHandler("Email already exist", 400))
        }



        const vendor = await vendorModel.create({
            name,
            ownerName,
            foodTypes,
            pinCode,
            address,
            phone,
            email,
            serviceAvailable,
            coverImages,
            rating,
            password,
            foods: []
        })
        return res.status(200).json({
            success: true,
            vendor
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getAllVendors = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await vendorModel.find({}).select('-password -createdAt -updatedAt -__v');

        res.status(200).json({
            success: true,
            vendorLength: vendors.length,
            vendors
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getVendorById = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ErrorHandler('Invalid id parameter', 400))
        };

        const vendorExist = await vendorModel.findById(id);

        if (!vendorExist) {
            return next(new ErrorHandler('This vendor does not exist', 400))
        }


        return res.status(200).json({
            success: true,
            vendorExist
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {


    const transactions = await Transaction.find();

    if (transactions) {
        return res.status(200).json(transactions)
    }

    return res.json({ "message": "Transactions data not available" })

}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if (transaction) {
        return res.status(200).json(transaction)
    }

    return res.json({ "message": "Transaction data not available" })

}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const { _id, status } = req.body;

    if (_id) {

        const profile = await DeliveryUser.findById(_id);

        if (profile) {
            profile.verified = status;
            const result = await profile.save();

            return res.status(200).json(result);
        }
    }

    return res.json({ message: 'Unable to verify Delivery User' });
}


export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUsers = await DeliveryUser.find();

    if (deliveryUsers) {
        return res.status(200).json(deliveryUsers);
    }

    return res.json({ message: 'Unable to get Delivery Users' });
}