import { useState } from 'react';
import { Navigate } from 'react-router-dom';

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import ContactProfile from './ContactProfile';

// icons
import { FiMoreVertical, FiUser, FiTrash2, FiFlag, FiVolume2, FiVolumeX } from 'react-icons/fi';

// hooks
import useContacts from '@/hooks/useContacts';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderMenuProps {
  contactId: string;
}

const ChatHeaderMenu = ({ contactId }: ChatHeaderMenuProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { contacts } = useContacts();
  const { toast } = useToast();

  const contact = contacts.find((c) => c._id === contactId);
  if (!contact) return <Navigate to={'/not-found'} replace={true} />;

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // TODO: Implement mute functionality
    //  will push contact id in userDetails muted[] arr
    toast({
      title: 'Mute  functionality',
      description: 'Mute  functionality not yet Implemented',
    });
  };

  const handleClearChat = () => {
    // TODO: Implement clear chat functionality
    // dispatch(clearUnreadCount(contactId));
    toast({
      title: 'Clear Chat  functionality',
      description: 'Clear Chat  functionality not yet Implemented',
    });
  };

  const handleReportContact = () => {
    // TODO: Implement report functionality
    toast({
      title: 'Report Contact  functionality',
      description: 'Report Contact  functionality not yet Implemented',
    });
  };

  if (showProfile) {
    return <ContactProfile contactId={contactId} onClose={() => setShowProfile(false)} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <FiMoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewProfile}>
          <FiUser className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMuteToggle}>
          {isMuted ? (
            <>
              <FiVolume2 className="mr-2 h-4 w-4" />
              Unmute
            </>
          ) : (
            <>
              <FiVolumeX className="mr-2 h-4 w-4" />
              Mute
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearChat}>
          <FiTrash2 className="mr-2 h-4 w-4" />
          Clear Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleReportContact} className="text-destructive">
          <FiFlag className="mr-2 h-4 w-4" />
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatHeaderMenu;
