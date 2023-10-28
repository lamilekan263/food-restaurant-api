import mongoose from 'mongoose';


const dbUri = process.env.DB_URL || ''
const connectDB = async () => {
    try {
        mongoose.connect(dbUri).then((data) => {
            console.log(`connected successfully on ${data.connection.host}`)
        })
    } catch (error) {
        console.log('error connecting to the databse');
        setTimeout(connectDB, 3000)
    }
}

export default connectDB