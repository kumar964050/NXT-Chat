import { useEffect, useState } from 'react';

// components
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
// hooks
import useContacts from '@/hooks/useContacts';
import useCall from '@/hooks/useCall';
// icons
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

const Active = () => {
  const {
    callDuration,
    declineCall,
    currentCall,
    isMuted,
    localVideoRef,
    remoteVideoRef,
    toggleMute,
    isVideoOff,
    toggleVideo,
  } = useCall();
  const { contacts } = useContacts();
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const getCallStatusText = (status) => {
    switch (status) {
      case 'ringing':
        return 'Calling...';
      case 'ongoing':
        return 'ongoing';
      case 'ended':
        return 'Call ended';
      default:
        return 'Connecting...';
    }
  };
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLVideoElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };
  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  if (!currentCall) return null;
  const contact = contacts.find(
    (c) => c._id === currentCall.receiverId || c._id === currentCall.callerId
  );

  return (
    <div className="fixed inset-0 bg-gradient-primary z-50 flex flex-col">
      {/* header */}
      <div className="z-50 flex justify-center items-center p-5 space-x-3">
        <div className="text-center space-y-6">
          <Avatar className="w-15 h-15">
            <AvatarImage
              className="w-15 h-15 rounded-full object-cover"
              src={contact?.image?.url}
            />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-4xl font-bold h-25 w-25">
              {contact?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white ">
            {contact?.name || 'Unknown Contact'}
          </h2>
          <p className="text-sm text-primary-foreground/80">
            {getCallStatusText(currentCall.status)}
          </p>
          <p className="text-xs text-primary-foreground/80">{formatDuration(callDuration)}</p>
        </div>
      </div>

      {/* remote audio */}
      {currentCall.type === 'audio' && <audio ref={remoteVideoRef} autoPlay playsInline />}
      {/* remote video */}
      {currentCall.type === 'video' && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute z-10 bg-black top-0 bottom-0 left-0 right-0 h-screen w-screen object-cover"
        />
      )}

      {/* local video */}
      {currentCall.type === 'video' && (
        <div>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="fixed bg-black border-2 object-cover border-gray-300 rounded-lg z-50  bottom-0 right-0 w-30 md:w-80 md:h-50"
            onMouseDown={handleMouseDown}
            style={{ top: position.y, left: position.x, zIndex: 1000, cursor: 'move' }}
          />
        </div>
      )}

      {/* footer */}
      <div className="absolute  z-40 left-0 right-0 bottom-0 p-6 flex justify-center">
        <div className="flex items-center justify-center gap-6">
          {/* Mute Button */}
          <Button
            size="lg"
            variant={isMuted ? 'destructive' : 'secondary'}
            className="rounded-full cursor-pointer h-16 w-16"
            onClick={toggleMute}
          >
            {isMuted ? <FiMicOff className="h-6 w-6" /> : <FiMic className="h-6 w-6" />}
          </Button>

          {/* Video Button (only show for video calls) */}
          {currentCall.type === 'video' && (
            <Button
              size="lg"
              variant={isVideoOff ? 'destructive' : 'secondary'}
              className="rounded-full cursor-pointer h-16 w-16"
              onClick={toggleVideo}
            >
              {isVideoOff ? <FiVideoOff className="h-6 w-6" /> : <FiVideo className="h-6 w-6" />}
            </Button>
          )}

          {/* End Call Button */}
          <Button
            size="lg"
            variant="destructive"
            className="rounded-full cursor-pointer h-16 w-16"
            onClick={declineCall}
          >
            <FiPhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Active;
