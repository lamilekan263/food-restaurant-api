import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs'

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
interface IVendorDoc extends Document {
    name: string;
    ownerName: string;
    foodTypes: [string];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    foods?: any;
    comparePassword: (password: string) => Promise<Boolean>

}


const vendorSchema: Schema<IVendorDoc> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please your name']
    },
    ownerName: {
        type: String,
        required: [true, 'please enter an owner name']
    },
    foodTypes: [String],
    pinCode: {
        type: String,
        required: [true, 'please enter an pinCode']
    },
    address: {
        type: String,
        required: [true, 'please enter an address']
    },
    phone: {
        type: String,
        required: [true, 'please your phone']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: {
            validator: (val: any) => {
                return emailRegex.test(val);
            },
            message: 'Please enter a valid email address'
        }

    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        select: false
    },
    serviceAvailable: {
        type: Boolean,
    },
    coverImages: {
        type: [String]

    },
    rating: {
        type: Number,
        default: 0
    },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food',

    }]
}, {
    timestamps: true
})

vendorSchema.pre<IVendorDoc>('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

vendorSchema.methods.comparePassword = async function (enteredPassword: string): Promise<Boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const vendorModel: Model<IVendorDoc> = mongoose.model('Vendor', vendorSchema)

export default vendorModel