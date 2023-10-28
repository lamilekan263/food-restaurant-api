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