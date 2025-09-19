import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  bio: string;
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  is_verified: boolean;
  last_seen: Date;
  image: { url: string | null | undefined; id: string | null | undefined };
  forgotPassword: {
    expiry: Date | null | undefined;
    token: string | null | undefined;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken: () => string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, default: "Hey!..." },
    password: { type: String, required: true, select: false },
    is_active: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    image: {
      id: { type: String, default: null },
      url: { type: String, default: null },
    },
    forgotPassword: {
      expiry: { type: Date, default: null, select: false },
      token: { type: String, default: null, select: false },
    },
    last_seen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// encrypt password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate auth token
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string);
};

export default mongoose.model<IUser>("User", UserSchema);
