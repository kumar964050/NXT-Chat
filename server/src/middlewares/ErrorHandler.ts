import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

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
    message: err.message || "server error",
  });
};

export default ErrorHandler;
