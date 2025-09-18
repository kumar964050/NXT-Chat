import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import User, { IUser } from "../models/user.model";
import Message from "../models/message.model";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import { AuthRequest, AuthFileRequest } from "../types";
import { uploadSingleFile } from "../config/cloudinary";
import mongoose from "mongoose";

//  get me
const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const contacts = await User.find({ _id: { $ne: userId } }).select(
    "-password"
  );

  const lastMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ from: userId }, { to: userId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$from", userId] },
            "$to", // 👈 if I sent the message → group by recipient
            "$from", // 👈 else → group by sender
          ],
        },
        lastMsg: { $first: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: { $toString: "$_id" }, // 👈 force string for map lookup
        lastMsg: 1,
      },
    },
  ]);

  const lastMsgMap = new Map(lastMessages.map((m) => [m._id, m.lastMsg]));

  const result = contacts.map((contact: IUser) => ({
    ...contact.toObject(),
    lastMessage: lastMsgMap.get(contact._id.toString()) || null,
  }));

  res.json({
    status: "success",
    message: "Fetched user profile successfully",
    data: { users: result, results: result.length },
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
const removeProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  // will imp login here
  // todo

  res.json({
    status: "success",
    message: "Profile image has been removed successfully",
  });
};
const ChangePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new CustomError("Current password and new password are required", 400)
    );
  }

  if (newPassword.length < 8) {
    return next(
      new CustomError("New password must be at least 8 characters long", 400)
    );
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new CustomError("User details not found", 404));
  }

  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return next(new CustomError("Incorrect Current Password", 400));
  }

  user.password = newPassword;
  await user.save();

  res.json({
    status: "success",
    message: "Password updated successfully",
  });
};
export default {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateUserDetails,
  uploadProfileImage,
  deleteAccount,
  removeProfileImage,
  ChangePassword,
};
