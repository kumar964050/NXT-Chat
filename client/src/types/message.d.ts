export interface Message {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
  from: string;
  to: string;
  content: string;

  attachment?: {
    id: string;
    url: string;
    name: string;
    size: number;
  };

  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}
