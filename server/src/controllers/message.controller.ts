import { AuthRequest, AuthFileRequest } from "../types";
import { Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";
import Messages from "../models/message.model";

import { uploadSingleFile } from "../config/cloudinary";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";

//  add new msg
const addMsg = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }
  const newMsg = await Messages.create(req.body);
  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.MESSAGE_SENT,
    data: { message: newMsg },
  });
};

const uploadFileMsg = async (
  req: AuthFileRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  if (!req.files || !req.files?.file) {
    return next(new CustomError(ERROR_MESSAGES.MESSAGE_FILE_REQUIRED, 400));
  }

  const dirname = `messages/${req.body.type}`;
  const data = await uploadSingleFile(req.files.file as any, dirname);

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.FILE_UPLOADED,
    data: { file: data },
  });
};

const getMsg = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 400));
  }

  const chatId = String(req.query.chatId || "");
  if (!chatId) return next(new CustomError("Receiver Id Required", 400));

  const query: any = {
    $or: [
      { from: req.user._id, to: chatId },
      { to: req.user._id, from: chatId },
    ],
    is_deleted: false,
  };

  const messages = await Messages.find(query).sort({ createdAt: 1 });

  res.json({
    status: "success",
    message: SUCCESS_MESSAGES.MESSAGES_FETCHED,
    data: { messages },
  });
};

export default { addMsg, uploadFileMsg, getMsg };
