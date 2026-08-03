import {v2 as cloudinary} from "cloudinary"
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERET
})

const uploadOnCloudinary = async(filepath)=>{
    try {
        if(!filepath){
            return null;
        }

        const result = await cloudinary.uploader.upload(filepath);
        // console.log(result);
        fs.unlinkSync(filepath);
        return (await result).secure_url;
    } catch (error) {
        fs.unlinkSync(filepath);
        console.log(`cloudinary error ${error}`)
    }
}

export default uploadOnCloudinary;