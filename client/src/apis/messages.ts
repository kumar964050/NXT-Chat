import { apiFetch } from './index';
import { messagesResponse, Message } from '@/types';

const addMsg = (token, data: Message) =>
  apiFetch<Message>('/messages', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });

const getMsgs = (token: string, from: string, to: string) =>
  apiFetch<messagesResponse>(`/messages?from=${from}&&to=${to}`, {
    method: 'GET',
    token,
  });

export default {
  addMsg,
  getMsgs,
};
