import { apiFetch } from './index';
import { UsersResponse, UserResponse, BaseResponse } from '@/types/responses';
import { UpdateUserFormDataProps, ChangePasswordProps } from '@/types/user';

// GET : list users
const getUsers = (token: string) =>
  apiFetch<UsersResponse>('/users', {
    method: 'GET',
    token,
  });

// GET : Logged in user profile
const me = (token: string) =>
  apiFetch<UserResponse>('/users/me', {
    method: 'GET',
    token,
  });

// PUT : Update user
const updateUserDetails = (token, id: string, data: UpdateUserFormDataProps) =>
  apiFetch<UserResponse>(`/users/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });

const changePassword = (token, id: string, data: ChangePasswordProps) =>
  apiFetch<BaseResponse>(`/users/${id}/change-password`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });

// DELETE : account delete(soft delete)
const deleteAccount = (token, id: string) =>
  apiFetch<BaseResponse>(`/users/${id}`, {
    method: 'DELETE',
    token,
  });

// DELETE : Remove user profile image
const removeProfileImage = (token, id: string) =>
  apiFetch<BaseResponse>(`/users/${id}/profile-image`, {
    method: 'DELETE',
    token,
  });

export default {
  getUsers,
  me,
  updateUserDetails,
  deleteAccount,
  removeProfileImage,
  changePassword,
};
