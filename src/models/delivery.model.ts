import mongoose, { Schema, Document, Model } from 'mongoose';

import bcrypt from 'bcryptjs'

interface DeliveryUserDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    pincode: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    isAvailable: boolean;
    comparePassword: (password: string) => Promise<Boolean>
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const DeliveryUserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'An email address is expected'],
        unique: true,
        validate: {
            validator: (val: any) => {
                return emailRegex.test(val)
            },
            message: "Please input a valid email"
        }
    },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    pincode: { type: String },
    verified: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean, default: false }

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});

DeliveryUserSchema.pre<DeliveryUserDoc>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


DeliveryUserSchema.methods.comparePassword = async function (inputPassword: string): Promise<Boolean> {
    return await bcrypt.compare(inputPassword, this.password)
}


const DeliveryUser = mongoose.model<DeliveryUserDoc>('deliveryUser', DeliveryUserSchema);

export { DeliveryUser }