import { apiFetch } from './index';
import { BaseResponse, UserResponse } from '@/types/responses';
import { LoginFormDataProps, RegisterFormDataProps } from '@/types/auth';

// POST: Login
const login = (data: LoginFormDataProps) =>
  apiFetch<UserResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// POST : Register
const register = (data: RegisterFormDataProps) =>
  apiFetch<BaseResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// POST : Logout
const logout = (token: string) =>
  apiFetch<BaseResponse>('/auth/logout', {
    method: 'POST',
    token,
  });

// POST : Forgot Password
const forgotPassword = (identity: string) =>
  apiFetch<BaseResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identity }),
  });

// PATCH : Reset Password
const resetPassword = (token: string, password: string) =>
  apiFetch<BaseResponse>('/auth/reset-password', {
    method: 'PATCH',
    body: JSON.stringify({ reset_token: token, password }),
  });

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
};
