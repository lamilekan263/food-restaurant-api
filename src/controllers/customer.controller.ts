import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { ICustomerLoginBody, ICustomerSignUpBody } from "../dto";
import { customerModel } from "../models/customer.model";
import { generateOtp } from "../utils/generateOtp";
import { sendMail } from "../utils/sendEmail";
import { createToken } from "../utils/jwt";



export const customerSignUp = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName } = req.body as ICustomerSignUpBody;
        const isUserExist = await customerModel.findOne({ email });
        if (isUserExist) {
            return next(new ErrorHandler("A user with this email already exist", 400))
        };

        const { otp, expiry } = generateOtp();

        const customer = await customerModel.create({
            email,
            password,
            firstName,
            lastName,
            otp,
            otpExpiry: expiry
        });

        const data = {
            user: {
                firstName,
                otp
            }
        }
        const token = createToken(customer)
        await sendMail({ data, email, subject: 'Your Otp code', template: 'sendOtpTemplate.ejs' });
        res.status(200).json({
            token,
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))

    }
});


export const customerLogin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ICustomerLoginBody;

        if (!email || !password) {
            return next(new ErrorHandler('Invalid email or password', 400))
        };

        const userExist = await customerModel.findOne({ email }).select('+password');

        if (!userExist) {
            return next(new ErrorHandler('Invalid email or password', 400))
        };

        const isPasswordMatch = await userExist.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler('Invalid email or password', 400))
        };

        const token = createToken(userExist);

        res.status(200).json({
            success: true,
            token
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});


// in progess
export const customerVerify = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const user = req.user;

        const profile = await customerModel.findOne({ email: user?.email });

        if (!profile) {
            return next(new ErrorHandler('this user does not exist', 400))
        };

        if (otp === profile.otp && profile.otpExpiry >= new Date()) {
            profile.verified = true;

            return res.status(200).json({
                success: true,
                message: 'verification successfull'
            })
        }
        return res.status(400).json({
            success: false,
            message: 'Invalid otp or expired code'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});


// profile
export const customerProfile = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user;

        const profile = await customerModel.findOne({ email: user?.email }).select('-password -otp -otpExpiry -createdAt -updatedAt -__v');

        if (!profile) {
            return next(new ErrorHandler('this user does not exist', 400))
        };

        return res.status(200).json({
            success: true,
            user: profile
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});



export const editProfile = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user;
        const { firstName, lastName, address } = req.body
        const profile = await customerModel.findOne({ email: user?.email }).select('-password -otp -otpExpiry -createdAt -updatedAt -__v');

        if (!profile) {
            return next(new ErrorHandler('this user does not exist', 400))
        };

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;

        await profile.save();
        return res.status(200).json({
            success: true,
            user: profile
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});

export const requestOtp = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user;
        const { firstName, lastName, address } = req.body
        const profile = await customerModel.findOne({ email: user?.email }).select('-password -otp -otpExpiry -createdAt -updatedAt -__v');

        if (!profile) {
            return next(new ErrorHandler('this user does not exist', 400))
        };

        const { expiry, otp } = generateOtp();

        profile.otp = otp;
        profile.otpExpiry = expiry

        await profile.save();

        const data = {
            user: {
                firstName,
                otp
            }
        }


        await sendMail({ data, email: profile.email, subject: 'Your Otp code', template: 'sendOtpTemplate.ejs' });
        return res.status(200).json({
            success: true,
            message: 'Otp generated sent successfully'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
});