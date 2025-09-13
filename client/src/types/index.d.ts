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

export interface Message {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
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
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
}
export interface UserResponse extends BaseResponse {
  data: {
    user: User;
  };
}
export interface UsersResponse extends BaseResponse {
  data: {
    users: User[];
  };
}
export interface UserWithTokenResponse extends BaseResponse {
  token: string;
  data: {
    user: User;
  };
}

export interface messagesResponse extends BaseResponse {
  data: {
    messages: Message[];
  };
}
export interface messageResponse extends BaseResponse {
  data: {
    message: Message;
  };
}

interface fileUploadResponse {
  id: string;
  url: string;
  name: string;
  size: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
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
  mv: (savePath: string, callback: (err) => void) => void;
}
