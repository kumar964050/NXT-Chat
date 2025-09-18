import { Message } from './message';

export interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  image: {
    id: string | null;
    url: string | null;
  };
  is_deleted: boolean;
  is_verified: boolean;
  last_seen: Date;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserFormDataProps {
  name: string;
  username: string;
  email: string;
  bio: string;
}

export interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
