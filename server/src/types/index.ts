import { Request } from "express";
import { UploadedFile, FileArray } from "express-fileupload"; // <-- use official types
import { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export interface AuthFileRequest extends AuthRequest {
  files?: FileArray | null;
}
