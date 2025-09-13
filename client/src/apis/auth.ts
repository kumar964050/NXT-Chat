import { apiFetch } from './index';
import { BaseResponse, UserWithTokenResponse } from '@/types';

// Login
const login = (data: { identity: string; password: string }) =>
  apiFetch<UserWithTokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Register
const register = (data: { username: string; email: string; password: string }) =>
  apiFetch<UserWithTokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Logout
const logout = (token: string) =>
  apiFetch<BaseResponse>('/auth/logout', {
    method: 'POST',
    token,
  });

// Forgot Password (request reset link)
const forgotPassword = (email: string) =>
  apiFetch<BaseResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identity: email }),
  });

// Reset Password (set new password)
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
