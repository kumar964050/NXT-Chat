import { useContext } from 'react';
import CallContext from '@/context/CallContext';

const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used inside CallProvider');
  return context;
};

export default useCall;
