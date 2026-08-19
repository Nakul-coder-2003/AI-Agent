// import redis from "../config/redis.js";
import { catchAsync } from "./catchAsync.js";

export const generateAndSaveOtp = catchAsync(async(email)=>{
    //6 digit otp
    const otp = Math.floor(100000 + Math.random()*900000).toString();

    // const redisKey = `otp_${email}`;
    // await redis.setex(redisKey,60,otp);

    console.log(`OTP sent to ${email}: ${otp}`);
    return { success: true, message: "OTP sent successfully" };
})