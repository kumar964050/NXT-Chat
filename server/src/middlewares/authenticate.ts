import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthFileRequest, AuthRequest } from "../types";

import CustomError from "../utils/CustomError";
import { ERROR_MESSAGES } from "../constants/messages";

async function Authenticate(
  req: AuthRequest | AuthFileRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined;

  // Check Authorization header for Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // if not token exist
  if (!token) {
    return next(new CustomError(ERROR_MESSAGES.INVALID_TOKEN, 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decode) {
    return next(new CustomError(ERROR_MESSAGES.INVALID_TOKEN, 401));
  }

  const { id } = decode as { id: string };
  const user = await User.findById(id);

  // remove exist token and redirect to login
  if (!user) {
    return next(new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }
  req.user = user;
  next();
}

export default Authenticate;
