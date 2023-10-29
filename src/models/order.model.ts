import mongoose, { Schema, Document, Model } from 'mongoose'



interface IOrder extends Document {
    orderId: string,
    vendorId: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers: boolean,
    offerId: string,
    readyTime: number
}


const OrderSchema: Schema<IOrder> = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    vendorId: {
        type: String,

    },
    items: {
        type: [{
            food: {
                type: mongoose.Schema.ObjectId,
                ref: 'food'
            }, unit: Number
        }]
    },
    totalAmount: Number,
    orderDate: Date,
    paidThrough: String,
    paymentResponse: String,
    orderStatus: String,
    remarks: String,
    deliveryId: String,
    appliedOffers: Boolean,
    offerId: String,
    readyTime: Number
})

export const orderModel: Model<IOrder> = mongoose.model('Order', OrderSchema);