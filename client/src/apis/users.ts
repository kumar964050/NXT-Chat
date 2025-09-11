import { apiFetch } from './index';
import { UsersResponse, UserResponse } from '@/types';

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

export default {
  getUsers,
  me,
};
