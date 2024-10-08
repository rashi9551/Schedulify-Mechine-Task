import mongo from 'mongoose'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectDB=async():Promise<void>=>{
    try {
        const MONGO_URLURL=process.env.MONGO_URL || 'mongodb://mongo:27017'
        if(!MONGO_URLURL)
            {
                throw new Error("MONGO_URL is not defined in environment variables.")
            }
            await mongoose.connect(`${MONGO_URLURL}/Schedulify`)
            console.log("database Connected");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error) 
    }
}

export default connectDB
