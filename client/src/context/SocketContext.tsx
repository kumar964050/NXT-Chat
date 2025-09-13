import useAuth from '@/hooks/useAuth';
import useContacts from '@/hooks/useContacts';
import { createContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BASE_URL;

interface SocketProviderProps {
  socket: Socket;
  activeUsers: string[];
}

const SocketContext = createContext<SocketProviderProps | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { userDetails } = useAuth();
  const { handleUserWentToOffline, handleUpdateLastMsg } = useContacts();

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, { autoConnect: true });
  }

  const value = {
    socket: socketRef.current!,
    activeUsers,
  };

  // clean up fun
  useEffect(() => {
    const socket = socketRef.current;

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // adding user id in socket list
  useEffect(() => {
    if (!userDetails) return;
    if (!socketRef.current) return;
    socketRef.current.emit('add-user', userDetails._id);
  }, [userDetails]);

  // get active users ids as arr
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('get-users', (data) => {
      if (data.length > 0) setActiveUsers(data);
    });
  }, []);

  // user went to offline
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('user-offline', (data) => {
      if (data) handleUserWentToOffline(data);
    });
  }, []);

  //read msg from socket to update in contact last msg
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('get-msg', (msg) => {
      if (msg) handleUpdateLastMsg(msg);
    });

    return () => {
      socketRef.current.off('get-msg');
    };
  }, []);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketContext;
