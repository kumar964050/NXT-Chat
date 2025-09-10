import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import User from "../models/user.model";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import { AuthRequest } from "../types";

//  get me
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

export default { getMyProfile };
