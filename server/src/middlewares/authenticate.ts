import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { AuthRequest } from "../types";

import CustomError from "../utils/CustomError";

async function Authenticate(
  req: AuthRequest,
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
    return next(new CustomError("Please Login again", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decode) {
    return next(new CustomError("Please Login again", 401));
  }

  const { id } = decode as { id: string };
  const user = await User.findById(id);

  // remove exist token and redirect to login
  if (!user) {
    return next(new CustomError("User details not found", 404));
  }
  req.user = user;
  next();
}

export default Authenticate;
