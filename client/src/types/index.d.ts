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
  createdAt: string;
  updatedAt: string;
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
export interface UserWithTokenResponse extends BaseResponse {
  token: string;
  data: {
    user: User;
  };
}
