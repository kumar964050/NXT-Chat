import { Button } from '../ui/button';
import { FiPhone, FiVideo, FiArrowLeft } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
// import { setActiveChat } from '../../store/slices/chatSlice';
import ChatHeaderMenu from './ChatHeaderMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import useContacts from '@/hooks/useContacts';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useSocket from '@/hooks/useSocket';

const ChatHeader = () => {
  const { chatId: activeChat } = useParams();
  const { contacts } = useContacts();
  const navigator = useNavigate();
  const { activeUsers } = useSocket();

  const contact = contacts.find((c) => c._id === activeChat);
  if (!contact) return <Navigate to="/not-found" replace={true} />;

  const handleVoiceCall = () => {
    // dispatch(initiateCall({ receiverId: contact.id, type: 'voice' }));
  };

  const handleVideoCall = () => {
    // dispatch(initiateCall({ receiverId: contact.id, type: 'video' }));
  };

  const handleBackClick = () => {
    navigator('/app');
  };

  const formatLastSeen = (lastSeen: Date, isOnline: boolean) => {
    if (isOnline) return 'Online';
    return `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
  };

  return (
    <div className="bg-chat-header border-b border-border p-4 shadow-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="md:hidden">
            <FiArrowLeft className="h-4 w-4" />
          </Button>

          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                className=" w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground font-medium"
                src={contact?.image?.url}
              />
              <AvatarFallback className="px-4 py-3 rounded-full bg-gradient-primary text-primary-foreground font-medium">
                {contact?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {activeUsers.includes(contact._id) && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online-status border-2 border-chat-header rounded-full" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-primary-foreground">
              {contact.name.charAt(0).toUpperCase() + contact.name.slice(1)}
            </h2>
            <p className="text-xs text-primary-foreground/70">
              {formatLastSeen(contact.last_seen, activeUsers.includes(contact._id))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceCall}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <FiPhone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <FiVideo className="h-4 w-4" />
          </Button>
          <ChatHeaderMenu contactId={contact._id} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
