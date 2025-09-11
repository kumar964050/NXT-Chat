import { AuthRequest } from "../types";
import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import Messages from "../models/message.model";
import mongoose from "mongoose";

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

  const chatId = String(req.query.chatId || "");

  if (!chatId) return res.status(400).json({ error: "chatId required" });

  const query: any = {
    $or: [
      { from: req.user._id, to: chatId },
      { to: req.user._id, from: chatId },
    ],
  };

  const messages = await Messages.find(query);

  res.json({
    status: "success",
    message: "get messages successfully",
    data: { messages },
  });
};

export default { addMsg, getMsg };
