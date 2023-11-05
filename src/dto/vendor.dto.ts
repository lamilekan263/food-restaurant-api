export interface Ivendor {
    name: string,
    ownerName: string,
    foodTypes: [string],
    pinCode: string,
    address: string,
    phone: string,
    email: string
    serviceAvailable: boolean
    coverImages: [string],
    rating: number,
    password: string
    // foods: any
    _id: string,
}

export interface IVendorLoginBody {
    email: string;
    password: string;
}

export interface IVendorUpdateProfileBody {
    name: string,
    foodTypes: [string],
    phone: string,
    address: string,
}

export interface ICreateOfferInputs {
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