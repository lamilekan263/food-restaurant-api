import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { adminRouter, shoppingRouter, vendorRouter, customerRouter, orderRouter } from './routes';
import { ErrorMiddleware } from './middlewares/error';
import path from 'path'


export const app = express();

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')))
app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})
app.use('/api/v1', vendorRouter)
app.use('/api/v1', adminRouter)
app.use('/api/v1', shoppingRouter)
app.use('/api/v1', customerRouter)
app.use('/api/v1', orderRouter)

app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`router ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})


app.use(ErrorMiddleware)