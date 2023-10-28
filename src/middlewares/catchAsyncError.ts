import { Request,Response,NextFunction } from "express"

export const CatchAsyncErrors = (theFunc:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
        return Promise.resolve(theFunc(req,res,next)).catch(next)
    }
}