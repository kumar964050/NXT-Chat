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

export default {
  getUsers,
  me,
  updateUserDetails,
  deleteAccount,
};
