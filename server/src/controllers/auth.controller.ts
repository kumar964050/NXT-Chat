import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import User from "../models/user.model";
import EmailService from "../services/EmailService";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";

// TODO : change logic to from server url to client URL
const getVerifyLinkWithToken = (req: Request, id: string) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const token = jwt.sign(
    { id },
    process.env.JWT_VERIFY_TOKEN_SECRET as string,
    {
      expiresIn: "20m",
    }
  );
  const link = `${protocol}://${host}/api/auth/verify-email?token=${token}`;
  return link;
};

// SignUp
const register = async (req: Request, res: Response, next: NextFunction) => {
  const findUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (findUser) {
    return next(new CustomError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 400));
  }

  const newUser = await User.create({
    ...req.body,
    name: req.body.email.split("@")[0],
  });

  // sending welcome mail to user
  EmailService.sendWelcomeEmail(
    newUser.email,
    newUser?.name ?? newUser.username
  );

  // sending email verification mail
  EmailService.emailVerification(
    newUser.email,
    newUser.name ?? newUser.username,
    getVerifyLinkWithToken(req, newUser._id.toString())
  );

  res.status(201).json({
    status: "success",
    message: SUCCESS_MESSAGES.USER_CREATED,
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
    EmailService.emailVerification(
      findUser.email,
      findUser.name ?? findUser.username,
      getVerifyLinkWithToken(req, findUser._id.toString())
    );

    return next(
      new CustomError(
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED +
          " " +
          SUCCESS_MESSAGES.EMAIL_VERIFICATION_SENT,
        401
      )
    );
  }

  // remove password from the response
  const { password, ...userData } = findUser.toObject();
  const token = findUser.generateAuthToken();

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    token,
    data: { user: userData },
  });
};

// forgot password ?
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    $or: [{ username: req.body.identity }, { email: req.body.identity }],
  }).select("+forgotPassword.expiry,forgotPassword.token");
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
    EmailService.resetPasswordLink(
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

// reset Password
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

  EmailService.resetPasswordSuccess(user.email, user?.name ?? user.username);

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.PASSWORD_RESET,
  });
};

// verify Email Address
const verifyEmailAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query.token as string;
  if (!token) {
    return next(new CustomError(ERROR_MESSAGES.INVALID_VERIFY_TOKEN, 400));
  }

  //
  const decoded = jwt.verify(
    token,
    process.env.JWT_VERIFY_TOKEN_SECRET as string
  ) as JwtPayload;

  if (!decoded?.id) {
    return next(new CustomError(ERROR_MESSAGES.INVALID_VERIFY_TOKEN, 400));
  }

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  // Mark user active (email verified)
  user.is_verified = true;
  await user.save();

  EmailService.emailVerificationSuccess(
    user.email,
    user?.name ?? user.username
  );

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
  });
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmailAddress,
};
