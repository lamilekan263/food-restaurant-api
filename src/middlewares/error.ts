import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    err.path = err.path
    // cast Error
    if (err.name === "CastError") {
        const message = `Invalid resource name ${err.path} name`;
        err = new ErrorHandler(message, 400);
    }

    // if (err.name === "Error") {
    //     const message = `Invalid resource name ${err.path} name`;
    //     err = new ErrorHandler(message, 400);
    // }

    // duplicate Error
    if (err.name === 11000) {
        const message = `Duplicate keys found ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message, 400);
    }

    // jsonwebtokenError
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid Jsonwebtoken: Try Again";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === 'Cast to ObjectId failed') {
        const message = " Try Again";
        err = new ErrorHandler(message, 400);
    }
    // tokenExpiredError
    if (err.name === "TokenExpiredError") {
        const message = "Token Expired: Try Again";
        err = new ErrorHandler(message, 400);
    }
  
    return res.status(err.statusCode).json({
    
        success: false,
        message: err.message,
    });
};
