import { apiFetch } from './index';
import { MessagesResponse, MessageResponse } from '@/types/responses';
import { Message } from '@/types/message';

const addMsg = (token, data: Message) =>
  apiFetch<MessageResponse>('/messages', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });

const getMsgs = (token: string, chatId: string) =>
  apiFetch<MessagesResponse>(`/messages?chatId=${chatId}`, {
    method: 'GET',
    token,
  });
const uploadFileMsg = (token: string, file) =>
  apiFetch<MessageResponse>(`/messages/file`, {
    method: 'POST',
    token,
    headers: { 'content-type': 'form/data' },
    body: file,
  });

export default {
  addMsg,
  getMsgs,
  uploadFileMsg,
};
