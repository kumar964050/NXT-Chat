import { apiFetch } from './index';
import { UsersResponse, UserResponse, BaseResponse } from '@/types';

const getUsers = (token: string) =>
  apiFetch<UsersResponse>('/users', {
    method: 'GET',
    token,
  });

const me = (token: string) =>
  apiFetch<UserResponse>('/users/me', {
    method: 'GET',
    token,
  });

interface UpdateUserData {
  name: string;
  email: string;
  username: string;
  bio: string;
}

const updateUserDetails = (token, id: string, data: UpdateUserData) =>
  apiFetch<UserResponse>(`/users/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
const deleteAccount = (token, id: string) =>
  apiFetch<BaseResponse>(`/users/${id}`, {
    method: 'DELETE',
    token,
  });
const removeProfileImage = (token, id: string) =>
  apiFetch<BaseResponse>(`/users/${id}/profile-image`, {
    method: 'DELETE',
    token,
  });

interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePassword = (token, id: string, data: ChangePasswordProps) =>
  apiFetch<BaseResponse>(`/users/${id}/change-password`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });

export default {
  getUsers,
  me,
  updateUserDetails,
  deleteAccount,
  removeProfileImage,
  changePassword,
};
