export interface Chat {
  id: number;
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  avatar: string;
  status: 'online' | 'offline';
}