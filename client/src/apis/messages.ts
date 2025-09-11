import { apiFetch } from './index';
import { messagesResponse, Message } from '@/types';

const addMsg = (token, data: Message) =>
  apiFetch<Message>('/messages', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });

const getMsgs = (token: string, chatId: string) =>
  apiFetch<messagesResponse>(`/messages?chatId=${chatId}`, {
    method: 'GET',
    token,
  });

export default {
  addMsg,
  getMsgs,
};
