// src/components/call/Overlay.tsx
import IncomingCall from './Incoming';
import Outgoing from './Outgoing';
import Active from './Active';
import useCall from '@/hooks/useCall';

const Overlay = () => {
  const { currentCall, isIncoming, isOutgoing, isInCall } = useCall();
  if (!currentCall) return null;
  if (isInCall) return <Active />;
  if (isIncoming) return <IncomingCall />;
  if (isOutgoing) return <Outgoing />;
  return null;
};

export default Overlay;
