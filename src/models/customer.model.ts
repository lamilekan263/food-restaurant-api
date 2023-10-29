import mongoose, { Schema, Model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'



interface ICustomerDoc extends Document {
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
    orders: [any]
    comparePassword: (password: string) => Promise<Boolean>
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const CustomerSchema: Schema<ICustomerDoc> = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    password: {
        type: String,
        select: false
    },
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
    address: {
        type: String
    },
    phone: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: Number,
    otpExpiry: Date,
    lat: Number,
    lng: Number,
    orders: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    }]
}, {
    timestamps: true
})




CustomerSchema.pre<ICustomerDoc>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


CustomerSchema.methods.comparePassword = async function (inputPassword: string): Promise<Boolean> {
    return await bcrypt.compare(inputPassword, this.password)
}



export const customerModel: Model<ICustomerDoc> = mongoose.model('customer', CustomerSchema);