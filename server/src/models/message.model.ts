import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  id: string;
  type: "text" | "image" | "video" | "audio" | "document" | "location";
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  content: string;
  attachment?: { id: string; url: string; name: string; size: number };
  location?: { latitude: number; longitude: number; address?: string };
  status: "sending" | "sent" | "delivered" | "read";
  is_deleted: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "document", "location"],
      required: true,
    },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachment: {
      id: { type: String },
      url: { type: String },
      name: { type: String },
      size: { type: Number },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sending",
    },
    is_deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
