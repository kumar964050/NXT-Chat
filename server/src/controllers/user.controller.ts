import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import User from "../models/user.model";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import { AuthRequest, AuthFileRequest } from "../types";
import { uploadSingleFile } from "../config/cloudinary";

//  get me
const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  // get active accounts
  const users = await User.find({
    _id: { $ne: req.user._id },
    is_active: true,
  });

  res.json({
    status: "success",
    message: "Fetched user profile successfully",
    data: { users: users, results: users.length },
  });
};
const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  // get active accounts
  const user = await User.findById(req.params.id);

  res.json({
    status: "success",
    message: "Fetched user profile successfully",
    data: { user },
  });
};
const getMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  const { forgotPassword, ...user } = req.user.toObject();
  res.json({
    status: "success",
    message: "Fetched user profile successfully",
    data: { user },
  });
};
const updateUserDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  const existingUser = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [
      { username: req.body.username.toLowerCase() },
      { email: req.body.email.toLowerCase() },
    ],
  });

  if (existingUser) {
    const field =
      existingUser.username === req.body.username.toLowerCase()
        ? "Username"
        : "Email";
    return next(new CustomError(`${field} already exists`, 400));
  }

  req.user.name = req.body.name;
  req.user.bio = req.body.bio;
  req.user.username = req.body.username;
  req.user.email = req.body.email;
  await req.user.save();

  res.json({
    status: "success",
    message: "updated user profile successfully",
    data: { user: req.user },
  });
};
const uploadProfileImage = async (
  req: AuthFileRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  if (!req.files || !req.files?.profile) {
    return next(new CustomError("Please provide profile image", 400));
  }

  const data = await uploadSingleFile(req.files.profile as any, "profile");

  req.user.image = data;
  await req.user.save();

  res.json({
    status: "success",
    message: "profile image has been updated successfully",
    data: { image: data },
  });
};
const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  req.user.is_active = false;
  await req.user.save();

  res.json({
    status: "success",
    message: "Your Account Has been deleted successfully",
  });
};

export default {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateUserDetails,
  uploadProfileImage,
  deleteAccount,
};
