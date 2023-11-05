import  { Request, Response, NextFunction } from 'express';

import { generateOtp } from '../utils/generateOtp';
import { DeliveryUser } from '../models';
import { createToken } from '../utils/jwt';
import { sendMail } from '../utils/sendEmail';
import { validate } from 'class-validator';


export const DeliverySignUp = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUserInputs = req.body

    const validationError = await validate(deliveryUserInputs, { validationError: { target: true } })

    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }

    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;



    const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

    if (existingDeliveryUser !== null) {
        return res.status(400).json({ message: 'A Delivery User exist with the provided email ID!' });
    }

    const result = await DeliveryUser.create({
        email: email,
        password,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        pincode: pincode,
        verified: false,
        lat: 0,
        lng: 0,

    })

    if (result) {
        const { otp, expiry } = generateOtp();
        const data = {
            user: {
                firstName,
                otp
            }
        }
        const token = createToken(result)
        await sendMail({ data, email, subject: 'Your Otp code', template: 'sendOtpTemplate.ejs' });
        // Send the result
        return res.status(201).json({ token, verified: result.verified, email: result.email })

    }

    return res.status(400).json({ msg: 'Error while creating Delivery user' });


}

export const DeliveryLogin = async (req: Request, res: Response, next: NextFunction) => {


    const loginInputs = req.body;

    const validationError = await validate(loginInputs, { validationError: { target: true } })

    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }

    const { email, password } = loginInputs;

    const deliveryUser = await DeliveryUser.findOne({ email: email });
    if (deliveryUser) {
        const validation = await deliveryUser.comparePassword(password)

        if (validation) {

            const token = createToken(deliveryUser)

            return res.status(200).json({
                success: true,
                token
            })
        }
    }

    return res.json({ msg: 'Error Login' });

}

export const GetDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUser = req.user;

    if (deliveryUser) {

        const profile = await DeliveryUser.findOne({ email: deliveryUser.email });

        if (profile) {

            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile' });

}

export const EditDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {


    const deliveryUser = req.user;

    const customerInputs = req.body

    const validationError = await validate(customerInputs, { validationError: { target: true } })

    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if (deliveryUser) {

        const profile = await DeliveryUser.findOne({ email: deliveryUser.email });

        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()

            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile' });

}

/* ------------------- Delivery Notification --------------------- */


export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUser = req.user;

    if (deliveryUser) {

        const { lat, lng } = req.body;

        const profile = await DeliveryUser.findOne({ email: deliveryUser.email });

        if (profile) {

            if (lat && lng) {
                profile.lat = lat;
                profile.lng = lng;
            }

            profile.isAvailable = !profile.isAvailable;

            const result = await profile.save();

            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile' });

}