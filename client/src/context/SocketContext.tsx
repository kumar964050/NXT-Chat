import { createContext, useEffect, useRef, useState } from 'react';

// lib
import { io, Socket } from 'socket.io-client';
// hooks
import useAuth from '@/hooks/useAuth';
import useContacts from '@/hooks/useContacts';

// BASE SERVER URL
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

  // connecting to socket
  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, { autoConnect: true });
  }

  const value = {
    socket: socketRef.current!,
    activeUsers,
  };

  // cleanup function
  useEffect(() => {
    const socket = socketRef.current;

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Registering User in Socket : adding user id in socket list
  useEffect(() => {
    if (!userDetails) return;
    if (!socketRef.current) return;
    socketRef.current.emit('add-user', userDetails._id);
  }, [userDetails]);

  // GET List of Active User as arr from SOCKET
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('get-users', (data) => {
      if (data.length > 0) setActiveUsers(data);
    });
  }, []);

  // GET USER WENT Offline from SOCKET
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('user-offline', (data) => {
      if (data) handleUserWentToOffline(data);
    });
  }, []);

  //READ MSG From SOCKET TO Update in contacts as last msg
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
