import { IsEmail, Length } from "class-validator";

export interface ICustomerSignUpBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface ICustomer {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    verified: boolean,
    otp: number,
    otpExpiry: Date,
    lat: number,
    lng: number,
    orders: []
}

export interface ICustomerLoginBody {
    email: string,
    password: string
}


export interface ICreateOrderBodyInput {
    _id: string,
    unit: number
}