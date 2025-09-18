import { BaseResponse } from './common';
import { User } from './user';
import { Message } from './message';

export { BaseResponse } from './common';

// USER RESPONSES
export interface UserResponse extends BaseResponse {
  token?: string;
  data: { user: User };
}

export interface UsersResponse extends BaseResponse {
  data: { users: User[] };
}

// MESSAGE RESPONSES
export interface MessagesResponse extends BaseResponse {
  data: { messages: Message[] };
}

export interface MessageResponse extends BaseResponse {
  data: { message: Message };
}

// FILE UPLOAD RESPONSE
export interface FileUploadResponse {
  id: string;
  url: string;
  name: string;
  size: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
}
