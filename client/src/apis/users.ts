import { apiFetch } from './index';
import { LoginResponse } from '@/types';

const me = (token: string) =>
  apiFetch<LoginResponse>('/users/me', {
    method: 'GET',
    token,
  });

export default {
  me,
};
