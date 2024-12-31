import mongoose from 'mongoose';

export const ConnectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`connection ${connection.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
}