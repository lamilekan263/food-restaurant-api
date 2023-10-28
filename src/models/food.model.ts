import mongoose, { Schema, Document, Model } from 'mongoose';



export interface IFoodDoc extends Document {
    vendorId: string,
    name: string;
    description: string;
    category: string;
    foodType: [string];
    images: [string];
    readyTime: number;
    price: number;
    rating: number

}


const foodSchema: Schema<IFoodDoc> = new mongoose.Schema({
    vendorId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: String,
    foodType: {
        type: [String],
        required: true
    },
    images: {
        type: [String],
        required: true,
        default: []
    },
    readyTime: Number,
    price: Number,
    rating: {
        type: Number,
        default: 0
    }
})


export const foodModel: Model<IFoodDoc> = mongoose.model('food', foodSchema);