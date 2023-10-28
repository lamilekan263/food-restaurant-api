import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import vendorModel from "../models/vendor.model";
import { IFoodDoc } from "../models/food.model";


export const getFoodAvailability = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const pincode = req.params.pincode

        if (!pincode) {
            return next(new ErrorHandler('invalid parameter', 400))
        }

        const result = await vendorModel.find({ serviceAvailable: false, pinCode: pincode })
            .sort([['rating', 'descending']])
            .populate('foods');

        return res.status(200).json({
            success: true,
            result
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getTopRestaurants = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const pincode = req.params.pincode

        if (!pincode) {
            return next(new ErrorHandler('invalid parameter', 400))
        }

        const result = await vendorModel.find({ serviceAvailable: false, pinCode: pincode })
            .sort([['rating', 'descending']]).limit(10)


        return res.status(200).json({
            success: true,
            result
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getFoodAvailableIn30Mins = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const pincode = req.params.pincode

        if (!pincode) {
            return next(new ErrorHandler('invalid parameter', 400))
        }

        const result = await vendorModel.find({ serviceAvailable: false, pinCode: pincode })
            .sort([['rating', 'descending']]).populate('foods');

        const foodResult: any = []

        result.map(vendor => {
            const food = vendor.foods as [IFoodDoc];
            foodResult.push(...food.filter(food => food.readyTime > 30))
        })
        return res.status(200).json({
            success: true,
            foodResult
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const searchFood = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const pincode = req.params.pincode

        if (!pincode) {
            return next(new ErrorHandler('invalid parameter', 400))
        }

        const result = await vendorModel.find({ serviceAvailable: false, pinCode: pincode })
            .populate('foods');

        const foods: any = [];

        result.map(item => foods.push(...item.foods))
        return res.status(200).json({
            success: true,
            foods
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})



export const getRestaurantById = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = req.params.id

        if (!id) {
            return next(new ErrorHandler('invalid parameter', 400))
        }

        const result = await vendorModel.findById(id)
            .populate('foods');
        console.log(result)
        if (result) {
            return res.status(200).json({
                success: true,
                result
            })
           
        }

        return next(new ErrorHandler('Data not found', 400))
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})