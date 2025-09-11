import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  FiMoreVertical,
  FiUser,
  FiSearch,
  FiVolume2,
  FiVolumeX,
  FiTrash2,
  FiFlag,
} from 'react-icons/fi';
import ContactProfile from './ContactProfile';
import useContacts from '@/hooks/useContacts';
import { Navigate } from 'react-router-dom';

interface ChatHeaderMenuProps {
  contactId: string;
}

const ChatHeaderMenu = ({ contactId }: ChatHeaderMenuProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { contacts } = useContacts();

  const contact = contacts.find((c) => c._id === contactId);
  if (!contact) return <Navigate to={'/not-found'} replace={true} />;

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleSearchMessages = () => {
    // TODO: Implement search functionality
    console.log('Search messages');
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // TODO: Implement mute functionality
  };

  const handleClearChat = () => {
    // TODO: Implement clear chat functionality
    // dispatch(clearUnreadCount(contactId));
  };

  const handleReportContact = () => {
    // TODO: Implement report functionality
    console.log('Report contact');
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
        <DropdownMenuItem onClick={handleSearchMessages}>
          <FiSearch className="mr-2 h-4 w-4" />
          Search Messages
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
