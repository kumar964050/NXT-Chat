import { AuthRequest } from "../types";
import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import Messages from "../models/message.model";

// import User from "../models/user.model";
// import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";

//  add new msg
const addMsg = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }
  const newMsg = await Messages.create(req.body);
  res.json({
    status: "success",
    message: "message added successfully",
    data: { message: newMsg },
  });
};

const getMsg = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }
  const { from, to } = req.query;
  const getMessages = await Messages.find({
    $or: [
      { from: from, to: to },
      { to: from, from: to },
    ],
  });
  // sorting here

  res.json({
    status: "success",
    message: "get messages successfully",
    data: { messages: getMessages },
  });
};

export default { addMsg, getMsg };
