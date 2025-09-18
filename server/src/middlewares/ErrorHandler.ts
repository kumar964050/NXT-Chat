import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ERROR_MESSAGES } from "../constants/messages";

// TODO : implement errors for both Prod : dev mode here

const ErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  console.log(err.message);

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

export default ErrorHandler;
