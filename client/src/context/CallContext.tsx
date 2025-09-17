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
    try {
      const constraints = { audio: true, video: type === 'video' };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      return localStream;
    } catch (err) {
      console.error('Failed to get local stream', err);
      throw err;
    }
  };

  const createPeerConnection = (remoteUserId: string) => {
    const peer = new RTCPeerConnection(ICE_CONFIG);

    // Add local tracks
    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current as MediaStream);
    });

    // read remote tracks
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { target: remoteUserId, candidate: event.candidate });
      }
    };
    peerRef.current = peer;
    return peer;
  };

  // start call
  const startCall = async (receiverId: string, type: CallType) => {
    if (!socket || !userDetails) return;

    try {
      await getLocalStream(type);
      const peer = createPeerConnection(receiverId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      const callUserData: CurrentCallProps = {
        callerId: userDetails._id,
        receiverId,
        type,
        status: 'calling',
        offer,
      };

      socket.emit('call-user', callUserData);
      setCurrentCall(callUserData);
      setIsOutgoing(true);
    } catch (err) {
      console.error('startCall error', err);
    }
  };

  const answerCall = async () => {
    if (!currentCall || !socket || !userDetails) return;

    try {
      if (!currentCall.offer) {
        throw new Error('No offer present in current call');
      }

      await getLocalStream(currentCall.type);

      const peer = createPeerConnection(currentCall.callerId);
      await peer.setRemoteDescription(new RTCSessionDescription(currentCall.offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      await socket.emit('answer-call', {
        callerId: currentCall.callerId,
        receiverId: userDetails._id,
        type: currentCall.type,
        answer,
      });

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
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCurrentCall(null);
    setIsInCall(false);
    setIsIncoming(false);
    setIsOutgoing(false);
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled; // false = muted
      });
    }
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // false = video off
      });
    }
    setIsVideoOff((prev) => !prev);
  };

  useEffect(() => {
    if (!socket || !userDetails) return;

    // incoming call
    socket.on('incoming-call', (data: CurrentCallProps) => {
      if (!data) return;
      setCurrentCall(data);
      setIsIncoming(true);
      setIsOutgoing(false);
      setIsInCall(false);
    });

    // call answered
    socket.on(
      'call-answered',
      async (data: {
        callerId: string;
        receiverId: string;
        answer?: RTCSessionDescriptionInit;
      }) => {
        try {
          if (data.answer && peerRef.current) {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            setIsInCall(true);
            setIsOutgoing(false);
            setCurrentCall((c) => (c ? { ...c, status: 'ongoing' } : c));
          }
        } catch (err) {
          console.error('Failed to set remote desc on call-answered', err);
        }
      }
    );

    // ICE
    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (peerRef.current) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding received ICE candidate', err);
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
