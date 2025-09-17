import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import useAuth from '@/hooks/useAuth';

type CallType = 'audio' | 'video';
type CallStatus = 'calling' | 'ringing' | 'ongoing' | 'incoming' | 'outgoing' | 'ended';

interface CurrentCallProps {
  callerId: string;
  receiverId: string;
  type: CallType;
  status: CallStatus;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
}

interface CallContextType {
  currentCall: CurrentCallProps | null;
  isOutgoing: boolean;
  isIncoming: boolean;
  isInCall: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  callDuration: number;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  startCall: (receiverId: string, type: CallType) => Promise<void>;
  answerCall: () => Promise<void>;
  declineCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const { userDetails } = useAuth();
  // const { toast } = useToast();
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const [currentCall, setCurrentCall] = useState<CurrentCallProps | null>(null);
  const [isOutgoing, setIsOutgoing] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const getLocalStream = async (type: CallType) => {
    const constraints = {
      audio: true,
      video: type === 'video' && !isVideoOff,
    };
    if (!localStreamRef.current) {
      try {
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = s;
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
      } catch (err) {
        console.error('getUserMedia failed', err);
        throw err;
      }
    } else {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !isVideoOff));
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
    }
    return localStreamRef.current;
  };

  const createPeerConnection = (remoteUserId: string) => {
    const pc = new RTCPeerConnection(ICE_CONFIG);
    peerRef.current = pc;

    // remote
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    //ICE
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          to: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    // local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        const alreadyAdded = pc.getSenders().some((sender) => sender.track === track);
        if (!alreadyAdded) {
          pc.addTrack(track, localStreamRef.current!);
        }
      });
    }

    // Flush pending ICE
    pendingCandidates.current.forEach(async (c) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch (err) {
        console.warn('flush addIceCandidate error', err);
      }
    });
    pendingCandidates.current = [];

    return pc;
  };

  // start call
  const startCall = async (receiverId: string, type: CallType) => {
    if (!socket || !userDetails) return;

    try {
      await getLocalStream(type);

      const pc = createPeerConnection(receiverId);

      // 3) ensure local tracks are added (createPeerConnection does if stream exists)
      // 4) create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5) inform server -> server will forward to callee as incoming-call (include offer)

      const callUserData = {
        callerId: userDetails._id,
        receiverId,
        type,
        status: 'calling',
        offer,
      };
      socket.emit('call-user', callUserData);

      setCurrentCall({ callerId: userDetails._id, receiverId, type, status: 'calling', offer });
      setIsOutgoing(true);
    } catch (err) {
      console.error('startCall error', err);
    }
  };

  const answerCall = async () => {
    if (!currentCall || !socket || !userDetails) return;
    try {
      // 1) get local stream (attach to localVideoRef)
      await getLocalStream(currentCall.type);

      // 2) create pc & add local tracks
      const pc = createPeerConnection(currentCall.callerId);

      // 3) set remote description with caller's offer (must exist)
      if (currentCall.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(currentCall.offer));
      } else {
        console.warn('No offer present on currentCall');
      }

      // 4) create answer, set local desc
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 5) send answer back to caller -> server forwards as call-answered
      socket.emit('answer-call', {
        callerId: currentCall.callerId,
        receiverId: userDetails._id,
        type: currentCall.type,
        answer,
      });

      // update state
      setIsIncoming(false);
      setIsOutgoing(false);
      setIsInCall(true);
      setCurrentCall((c) => (c ? { ...c, status: 'ongoing', answer } : c));
    } catch (err) {
      console.error('answerCall failed', err);
    }
  };
  const declineCall = () => {
    if (!currentCall || !socket) return;
    socket.emit('end-call', {
      callerId: currentCall.callerId,
      receiverId: currentCall.receiverId,
    });
    endCall();
  };
  // end call
  const endCall = () => {
    setCurrentCall(null);
    setIsInCall(false);
    setIsIncoming(false);
    setIsOutgoing(false);
    setCallDuration(0);

    // stop and clear local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    // close peer
    if (peerRef.current) {
      try {
        peerRef.current.ontrack = null;
        peerRef.current.onicecandidate = null;
        peerRef.current.close();
      } catch {}
      peerRef.current = null;
    }

    // clear UI video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !next ? true : false));
      }
      return next;
    });
  };

  const toggleVideo = () => {
    setIsVideoOff((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !next ? true : false));
      }
      return next;
    });
  };

  useEffect(() => {
    if (!socket || !userDetails) return;

    // incoming call (caller included an offer in startCall)
    socket.on('incoming-call', (data: CurrentCallProps) => {
      // data should contain: callerId, receiverId, type, status, offer
      if (!data) return;
      setCurrentCall(data);
      setIsIncoming(true);
      setIsOutgoing(false);
      setIsInCall(false);
    });

    // call answered (caller receives callee's answer)
    socket.on(
      'call-answered',
      async (data: {
        callerId: string;
        receiverId: string;
        answer?: RTCSessionDescriptionInit;
      }) => {
        // only the caller should handle this: set remote desc on existing pc
        try {
          if (data?.answer && peerRef.current) {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
          setIsInCall(true);
          setIsOutgoing(false);
          setCurrentCall((c) => (c ? { ...c, status: 'ongoing' } : c));
        } catch (err) {
          console.error('Failed to set remote desc on call-answered', err);
        }
      }
    );

    // ICE candidate relays (both sides)
    socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (!candidate) return;
      if (peerRef.current) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('addIceCandidate error', err);
        }
      } else {
        // stash until peerRef exists
        pendingCandidates.current.push(candidate);
      }
    });

    // end-call: both sides cleanup
    socket.on('end-call', () => {
      endCall();
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-answered');
      socket.off('ice-candidate');
      socket.off('end-call');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userDetails]);

  // call duration timer
  useEffect(() => {
    if (!currentCall) {
      setCallDuration(0);
      return;
    }
    const i = setInterval(() => setCallDuration((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [currentCall]);

  const value: CallContextType = {
    currentCall,
    isOutgoing,
    isIncoming,
    isInCall,
    isMuted,
    isVideoOff,
    callDuration,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export default CallContext;
