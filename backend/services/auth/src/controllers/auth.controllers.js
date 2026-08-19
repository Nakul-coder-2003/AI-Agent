import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import generateToken from "../utils/token.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import jwt, { decode } from "jsonwebtoken";
// import redis from "../config/redis.js";
import { generateAndSaveOtp } from "../utils/sendOtp.js";


export const signup = catchAsync(async (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;

  if (!userName || !email || !password || !firstName || !lastName) {
    return next(new AppError("Please fill all required details", 400));
  }

  let profileImg;
  if (req.file) {
    profileImg = await uploadOnCloudinary(req.file.path);
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserAlreadyExists) {
    return next(new AppError("Account already exists", 400));
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    userName,
    email,
    password: hash,
    firstName,
    lastName,
    profileImg,
  });

  const { accessToken, refreshToken } = generateToken(newUser._id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "user signup successfully!",
    user: {
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    },
  });

});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid user", 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid crendials", 400));
  }

  const { accessToken, refreshToken } = generateToken(user._id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "user login successfully!",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        // if (expiresIn > 0) {
        //   await redis.setex(`bl_${token}`, expiresIn, "blacklisted");
        // }
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logout successful" });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return next(new AppError("user not found",400));

  await generateAndSaveOtp(email)
  return res
    .status(200)
    .json({ message: "Password reset OTP has been sent to your email" });
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and otp is required" });

  // const otpRecord = await redis.get(`otp_${email}`);
  
  if (!otpRecord || otpRecord !== otp) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired otp" });
  }

  // await redis.del(`otp_${email}`);

  return res
    .status(200)
    .json({ message: "OTP verified successfully", isVerified: true });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return next(new AppError("Invalid",400))
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  await userModel.findOneAndUpdate({ email }, { password: hashPassword });

  return res
    .status(200)
    .json({
      success: true,
      message: "Password reset successfully. Please login.",
    });
});
