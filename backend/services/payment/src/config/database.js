import mongoose from "mongoose"

const ConnectPaymentDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected!")
    } catch (error) {
        console.log(`error ${error}`)
    }
}

export default ConnectPaymentDB;