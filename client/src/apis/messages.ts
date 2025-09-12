import { apiFetch } from './index';
import { messagesResponse, Message, messageResponse, UploadedFile } from '@/types';

const addMsg = (token, data: Message) =>
  apiFetch<messageResponse>('/messages', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });

const getMsgs = (token: string, chatId: string) =>
  apiFetch<messagesResponse>(`/messages?chatId=${chatId}`, {
    method: 'GET',
    token,
  });
const uploadFileMsg = (token: string, file) =>
  apiFetch<messagesResponse>(`/messages/file`, {
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
