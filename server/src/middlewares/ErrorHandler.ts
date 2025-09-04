import { Request, Response, NextFunction } from "express";

// TODO : implement errors for both Prod : dev mode here
export default (err, req: Request, res: Response, next: NextFunction) => {
  // developer errors
  //
  // prod errors
  //
  console.log(err);
  console.log(err.message);

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "server error",
  });
};
