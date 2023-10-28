

export const generateOtp = () => {
    const otp = Math.floor(10000 + Math.random() * 90000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 + 60 + 1000));
    return {
        otp,
        expiry
    }
}