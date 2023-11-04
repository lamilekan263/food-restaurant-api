import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { ICreateOrderBodyInput, ICustomerLoginBody, ICustomerSignUpBody } from "../dto";
import { customerModel } from "../models/customer.model";
import { generateOtp } from "../utils/generateOtp";
import { sendMail } from "../utils/sendEmail";
import { createToken } from "../utils/jwt";
import { foodModel, orderModel } from "../models";



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



// cart
export const addToCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user;

        const { _id, unit } = req.body as ICreateOrderBodyInput;
        let cartItems = new Array();

        const profile = await customerModel.findOne({ email: user?.email }).populate({ path: 'cart.food', model: 'food' });

        if (!profile) {
            return next(new ErrorHandler('User does not exist', 400))
        }

        cartItems = profile.cart;
        const food = await foodModel.findById(_id);

        if (!food) {
            return next(new ErrorHandler('Food does not exist', 400))
        }

        if (cartItems.length > 0) {

            const foodInCart = cartItems.filter(item => item.food._id.toString() === _id);

            if (foodInCart.length > 0) {
                const index = cartItems.indexOf(foodInCart[0]);
                if (unit > 0) {
                    cartItems[index] = { food: _id, unit }
                } else {
                    cartItems.splice(index, 1)
                }
            } else {
                cartItems.push({ food: _id, unit })
            }

        } else if (unit <= 0) {
            // checking if unit is 0 or less than zero
            return next(new ErrorHandler("Sorry can't add 0 unit to your cart", 400))
        } else {
            // if the cart is empty
            cartItems.push({ food: _id, unit })
        }

        if (cartItems) {
            profile.cart = cartItems as any;
            await profile.save()
            return res.status(200).json({
                success: true,
                message: 'Add to cart successfully'
            })
        }

        return res.status(400).json({
            success: false,
            message: 'Unable to add to cart'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const profile = await customerModel.findOne({ email: user?.email }).populate('cart.food');

        if (!profile) {
            return next(new ErrorHandler("Profile not found", 400))
        }
        const cart = profile.cart;

        return res.status(200).json({
            success: true,
            cart
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const deleteCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const profile = await customerModel.findOne({ email: user?.email }).populate('cart.food');

        if (!profile) {
            return next(new ErrorHandler("Profile not found", 400))
        }
        profile.cart = [] as any;

        const cartResult = await profile.save();


        return res.status(200).json({
            success: true,
            cartResult: profile.cart
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

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
        let vendorId;
        foods.map(food => cart.map(({ _id, unit }) => {
            if (food._id == _id) {
                vendorId = food.vendorId;
                netAmount += food.price * unit;
                cartItems.push({ food, unit })
            }
        }))

        const createOrder = await orderModel.create({
            orderId: orderId,
            vendorId,
            items: cartItems,
            totalAmount: netAmount,
            orderDate: Date.now(),
            paidThrough: "COD",
            paymentResponse: "",
            orderStatus: "waiting",
            remarks: '',
            deliveryId: '',
            appliedOffers: false,
            offerId: null,
            readyTime: 45

        })
        profile.cart = [] as any;
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
        console.log(order)
        if (order == null) {
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
