import { useState } from 'react';
//
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
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
// types
import { BaseResponse } from '@/types/responses';
// apis
import UserAPis from '@/apis/users';
import useAuth from '@/hooks/useAuth';

interface ChatHeaderMenuProps {
  contactId: string;
}

const ChatHeaderMenu = ({ contactId }: ChatHeaderMenuProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const { contacts } = useContacts();
  const { userDetails, handleMuteUser } = useAuth();
  const { toast } = useToast();

  const contact = contacts.find((c) => c._id === contactId);
  if (!contact) return <Navigate to={'/not-found'} replace={true} />;
  const isMuted = (userDetails.muted ?? []).includes(contact._id);

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  // mute handler
  const handleMuteToggle = async () => {
    try {
      const token = Cookies.get('token');
      const data = await UserAPis.changeContactMuteStatus(token, contact._id, isMuted);
      if (data.status === 'success') {
        handleMuteUser(contact._id);
        toast({
          title: 'Mute/Unmute  Request',
          description: data.message as string,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed Mute  Request',
          description: data.message as string,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed Mute  Request',
        description: error.message as string,
      });
    }
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
