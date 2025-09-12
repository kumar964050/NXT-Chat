import { Request } from "express";

import { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export interface UploadedFile {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (savePath: string, callback: (err: any) => void) => void;
}

export interface AuthFileRequest extends Request {
  user?: IUser | null;
  files?: {
    [images: string]: UploadedFile | UploadedFile[];
  };
}
