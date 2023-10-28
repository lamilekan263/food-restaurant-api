require('dotenv').config()
import { app } from './app';
import connectDB from './service/db';

const dbUri = process.env.DB_URL || ''
const PORT = process.env.PORT || 8080
console.log(dbUri)

app.listen(PORT, () => {
    console.log(`server running port ${PORT}`)
    connectDB()
})