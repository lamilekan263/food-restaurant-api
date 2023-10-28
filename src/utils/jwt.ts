require('dotenv').config();
import jwt, { Secret } from 'jsonwebtoken';
import { AuthPayload } from '../dto';




export const createToken = (user: AuthPayload) => {
    return jwt.sign({ user }, process.env.SECRET_TOKEN as Secret, {
        expiresIn: '1d'
    })
}


export const verifyToken = (token: any) => {
    const user: { user: AuthPayload } = jwt.verify(token, process.env.SECRET_TOKEN as Secret) as { user: AuthPayload };
    return user
}