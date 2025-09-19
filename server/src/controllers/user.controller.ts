import { Response, NextFunction } from "express";
import mongoose from "mongoose";
// models
import User, { IUser } from "../models/user.model";
import Message from "../models/message.model";
//
import { uploadSingleFile } from "../config/cloudinary";
import CustomError from "../utils/CustomError";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import { AuthRequest, AuthFileRequest } from "../types";
import EmailService from "../services/EmailService";

//  get list of users
const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
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
    message: SUCCESS_MESSAGES.USERS_FETCHED,
    data: { users: result, results: result.length },
  });
};

// get user profile by id
const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  // get active accounts
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.USER_PROFILE_FETCHED,
    data: { user },
  });
};

// get my(logged in user) profile
const getMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.MY_PROFILE_FETCHED,
    data: { user: req.user },
  });
};

// delete user account(soft delete)
const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  req.user.is_active = false;
  req.user.is_verified = false;
  await req.user.save();

  // sending confirmation email to user
  EmailService.accountDeleted(
    req.user.email,
    req.user?.name ?? req.user.username
  );

  await Message.updateMany(
    { $or: [{ from: req.user._id }, { to: req.user._id }] },
    { $set: { is_deleted: true, deletedAt: new Date() } }
  );

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.ACCOUNT_DELETED,
  });
};

// TODO: remove user profile image
const removeProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  // will imp login here
  // todo

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.PROFILE_IMAGE_REMOVED,
  });
};

// Change User Password
const ChangePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new CustomError(ERROR_MESSAGES.PASSWORD_REQUIRED, 400));
  }

  if (newPassword.length < 8) {
    return next(new CustomError(ERROR_MESSAGES.PASSWORD_MIN_LENGTH, 400));
  }

  // Checking User
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  // Checking  Password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return next(
      new CustomError(ERROR_MESSAGES.INCORRECT_CURRENT_PASSWORD, 400)
    );
  }

  user.password = newPassword;
  await user.save();

  // inform to user
  EmailService.passwordUpdated(user.email, user?.name ?? user.username);

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
  });
};

// Update User Details
const updateUserDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
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

  // inform to user
  EmailService.userDetailsUpdated(
    req.user.email,
    req.user?.name ?? req.user.username
  );

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.USER_PROFILE_UPDATED,
    data: { user: req.user },
  });
};

// Update User Profile Image
const uploadProfileImage = async (
  req: AuthFileRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  if (!req.files || !req.files?.profile) {
    return next(new CustomError(ERROR_MESSAGES.PROFILE_IMAGE_REQUIRED, 400));
  }

  const data = await uploadSingleFile(req.files.profile as any, "profile");

  req.user.image = data;
  await req.user.save();

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.PROFILE_IMAGE_UPDATED,
    data: { image: data },
  });
};

const toggleMuteContact = async (
  req: AuthFileRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  const findUser = await User.findById(req.body.userId);
  if (!findUser) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }
  const muted = req.user.muted ?? [];
  console.log(muted);
  if (req.body.isMute) {
    const index = muted.findIndex((id) => id === findUser._id);
    if (index) muted.splice(index, 1);
  } else {
    muted.push(findUser._id);
  }
  req.user.muted = muted;
  await req.user.save();
  res.json({ status: "success", message: SUCCESS_MESSAGES.REQUEST_SUCCESS });
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
  toggleMuteContact,
};
