// lib
import { formatDistanceToNow } from 'date-fns';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// Components
import { Button } from '../ui/button';
import ChatHeaderMenu from './ChatHeaderMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Loading } from '@/components/ui/loading';
// icons
import { FiPhone, FiVideo, FiArrowLeft } from 'react-icons/fi';
// hooks
import useContacts from '@/hooks/useContacts';
import useSocket from '@/hooks/useSocket';
import useCall from '@/hooks/useCall';

const ChatHeader = () => {
  const { chatId: activeChat } = useParams();
  const contacts = useContacts();
  const { activeUsers } = useSocket();
  const { startCall } = useCall();
  const navigate = useNavigate();

  const formatLastSeen = (lastSeen: Date, isOnline: boolean) => {
    if (isOnline) return 'Online';
    return `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
  };
  const handleStartCall = (id, type) => startCall(id, type);
  const handleBackNavigation = () => () => navigate(-1);

  // loading
  if (contacts.isLoading) return <Loading />;

  // find customer in contacts list
  const contact = contacts.contacts.find((c) => c._id === activeChat);
  if (!contact) return <Navigate to="/not-found" replace={true} />;

  return (
    <div className="bg-chat-header border-b border-border p-4 shadow-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackNavigation} className="md:hidden">
            <FiArrowLeft className="h-4 w-4" />
          </Button>

          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                className="object-cover w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground font-medium"
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
            onClick={() => handleStartCall(contact._id, 'audio')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <FiPhone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStartCall(contact._id, 'video')}
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
