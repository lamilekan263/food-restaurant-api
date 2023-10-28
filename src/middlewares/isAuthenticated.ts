import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { verifyToken } from "../utils/jwt";
import { CatchAsyncErrors } from "./catchAsyncError";


export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new ErrorHandler('Please login to be able to access this resources', 400))
    };
    const decode = verifyToken(token);
    if (!decode) {
        return next(new ErrorHandler('Invalid access token', 400))
    };
    req.user = decode.user;
    next();
})