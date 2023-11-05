import mongoose, { Schema, Document, Model } from 'mongoose'


interface IOfferDoc extends Document {
    offerType: string,
    vendors: [any],
    title: string,
    description: string,
    minValue: number,
    offerAmount: number,
    startValidity: Date,
    endValidity: Date,
    promoCode: string,
    promoType: string,
    bank: [any],
    bins: [any],
    pincode: string,
    isActive: boolean
}

const offerSchema: Schema<IOfferDoc> = new mongoose.Schema({
    offerType: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: 'vendor' }],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: Date,
    endValidity: Date,
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bins: [{ type: String }],
    pincode: { type: String, required: true },
    isActive: Boolean
})



export const offerModel: Model<IOfferDoc> = mongoose.model('offer', offerSchema)