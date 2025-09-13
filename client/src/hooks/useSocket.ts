import { useContext } from 'react';

import SocketContext from '@/context/SocketContext';

const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used inside a SocketProvider');
  }
  return socket;
};

export default useSocket;
