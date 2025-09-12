import { AuthRequest, AuthFileRequest } from "../types";
import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import Messages from "../models/message.model";

import { uploadSingleFile } from "../config/cloudinary";

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
const uploadFileMsg = async (
  req: AuthFileRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError("Un Authorization error", 400));
  }

  if (!req.files || !req.files?.file) {
    return next(new CustomError("Please provide file", 400));
  }

  const dirname = `messages/${req.body.type}`;
  const data = await uploadSingleFile(req.files.file as any, dirname);

  res.json({
    status: "success",
    message: "file uploaded successfully",
    data: { file: data },
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

  const messages = await Messages.find(query).sort({ createdAt: 1 });

  res.json({
    status: "success",
    message: "get messages successfully",
    data: { messages },
  });
};

export default { addMsg, uploadFileMsg, getMsg };
