import { Request } from "express";
import { FileArray } from "express-fileupload"; // <-- use official types
import { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export interface AuthFileRequest extends AuthRequest {
  files?: FileArray | null;
}

// TODO: need to improve: socketIds:[] to store multiple sockets id for multiple logins
export interface ActiveUser {
  userId: string;
  socketId: string;
}
export interface SocketMessage {
  id: string;
  type: "text" | "image" | "video" | "audio" | "document" | "location";
  from: string;
  to: string;
  content: string;
  attachment?: {
    id: string;
    url: string;
    name: string;
    size: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: "sending" | "sent" | "delivered" | "read";
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}
