import { useContext } from 'react';
import CallContext from '@/context/CallContext';

const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside CallProvider');
  return ctx;
};

export default useCall;
