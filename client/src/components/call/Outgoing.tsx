// components
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
// icons
import { FiPhoneOff, FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
// hooks
import useCall from '@/hooks/useCall';
import useContacts from '@/hooks/useContacts';
import { useEffect, useState } from 'react';

const Outgoing = () => {
  const { currentCall, isMuted, isVideoOff, toggleMute, toggleVideo, localVideoRef, declineCall } =
    useCall();
  const { contacts } = useContacts();
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
  const contact = contacts.find((c) => c._id === currentCall.receiverId);

  return (
    <div className="fixed inset-0 bg-gradient-primary z-50 flex flex-col">
      {/* Call Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-primary-foreground p-8">
        <div className="text-center space-y-6">
          <Avatar className="h-25 w-25 mx-auto border-4 border-primary-foreground/20">
            <AvatarImage className="object-cover" src={contact?.image?.url} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-4xl font-bold">
              {contact?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-semibold mb-2">{contact?.name || 'Unknown Contact'}</h2>
            <p className="text-lg text-primary-foreground/80">Calling...</p>
          </div>
        </div>
      </div>
      {/* local video */}
      {currentCall.type === 'video' && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="fixed bottom-0 right-0 w-50 object-cover"
          onMouseDown={handleMouseDown}
          style={{ top: position.y, left: position.x, zIndex: 1000, cursor: 'move' }}
        />
      )}
      {/* Call Controls */}
      <div className="p-8">
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

export default Outgoing;
