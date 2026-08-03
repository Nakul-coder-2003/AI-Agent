import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import generateToken from "../utils/token.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const signup = catchAsync(async (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;

  if (!userName || !email || !password || !firstName || !lastName) {
    return next(new AppError("Please fill all required details",400))
  }

  let profileImg;
  if (req.file) {
    profileImg = await uploadOnCloudinary(req.file.path);
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserAlreadyExists) {
    return next(new AppError("Account already exists",400))
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

  const token = generateToken(newUser._id);

  res
    .cookie("token", token)
    .status(200)
    .json({ message: "user register successfully!" });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid user",400))
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid crendials",400))
  }

  const token = generateToken(user._id);

  res
    .cookie("token", token)
    .status(200)
    .json({
      message: "user login successfully!",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
});

export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  // if (token) {
  //   await blocklistModel.create({ token });
  // }

  res.clearCookie("token").json({ message: "user logout successfully" });
});





