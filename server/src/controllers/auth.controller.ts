import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import User from "../models/user.model";
import EmailService from "../services/EmailService";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";

// SignUp
const register = async (req: Request, res: Response, next: NextFunction) => {
  const findUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
    // is_deleted: false,
  });

  if (findUser) {
    return next(new CustomError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 400));
  }

  const newUser = await User.create({
    ...req.body,
    name: req.body.email.split("@")[0],
  });

  // sending welcome mail to user
  await EmailService.sendWelcomeEmail(
    newUser.email,
    newUser?.name ?? newUser.username
  );

  // remove password from the response
  const { password, forgotPassword, ...userData } = newUser.toObject();
  const token = newUser.generateAuthToken();

  res.status(201).json({
    status: "success",
    message: SUCCESS_MESSAGES.USER_CREATED,
    token,
    data: { user: userData },
  });
};

// Sign In
const login = async (req: Request, res: Response, next: NextFunction) => {
  const findUser = await User.findOne({
    $or: [{ username: req.body.identity }, { email: req.body.identity }],
  }).select("+password");

  if (!findUser) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  const compared = await findUser.comparePassword(req.body.password);
  if (!compared) {
    return next(new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
  }

  // user not verified email send verify email
  if (!findUser.is_verified) {
    // await EmailService.sendWelcomeEmail(findUser.email, req.body.ownerName);
  }

  // remove password from the response
  const { password, forgotPassword, ...userData } = findUser.toObject();
  const token = findUser.generateAuthToken();

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    token,
    data: { user: userData },
  });
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    $or: [{ username: req.body.identity }, { email: req.body.identity }],
    //    is_deleted: false,
  });
  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  try {
    const token = crypto.randomBytes(34).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 20);

    user.forgotPassword = { token, expiry };
    await user.save();

    const url = `${process.env.CLIENT_URL}/auth/reset-password`;
    const link = url + `?token=${token}`;

    // sending link to user email id
    await EmailService.resetPasswordLink(
      user.email,
      user?.name ?? user.username,
      link
    );

    res.json({
      status: "success",
      message: SUCCESS_MESSAGES.FORGOT_PASSWORD_EMAIL_SENT,
    });
  } catch (error: any) {
    user.forgotPassword = { expiry: null, token: null };
    await user.save();
    next(new CustomError(error?.message || "Server error", 500));
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    "forgotPassword.expiry": { $gt: Date.now() },
    "forgotPassword.token": req.body.reset_token,
  });

  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  user.password = req.body.password;
  user.forgotPassword = { token: null, expiry: null };

  await user.save();

  await EmailService.resetPasswordSuccess(
    user.email,
    user?.name ?? user.username
  );

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.PASSWORD_RESET,
  });
};

export default { register, login, forgotPassword, resetPassword };
