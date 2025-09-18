// lib
import { formatDistanceToNow } from 'date-fns';
// components
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
// icons
import {
  FiPhone,
  FiVideo,
  FiMessageCircle,
  FiImage,
  FiFileText,
  FiVolume2,
  FiFlag,
  FiUserX,
} from 'react-icons/fi';
// hooks
import useContacts from '@/hooks/useContacts';
import useSocket from '@/hooks/useSocket';
// types

interface ContactProfileProps {
  contactId: string;
  onClose: () => void;
}

const ContactProfile = ({ contactId, onClose }: ContactProfileProps) => {
  const { contacts } = useContacts();
  const { activeUsers } = useSocket();

  const contact = contacts.find((c) => c._id === contactId);
  if (!contact) return null;

  const formatLastSeen = (lastSeen: Date, isOnline: boolean) => {
    if (isOnline) return 'Online';
    return `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`;
  };

  const isOnline = activeUsers.includes(contact._id);

  const photosCount = 10;
  const documentCount = 90;

  return (
    <div className="fixed z-50 bg-white/80 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
      <div className="w-full max-w-2xl max-h-100 overflow-y-auto bg-background border-l border-border rounded-2xl py-10">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="relative mx-auto w-15 h-15">
              <Avatar className="w-15 h-15">
                <AvatarImage className="w-15 h-15 object-cover" src={contact?.image?.url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {contact?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-status-online border-4 border-background rounded-full" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{contact.name}</h2>
              <p className="text-sm text-muted-foreground">@{contact.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatLastSeen(contact.last_seen, isOnline)}
              </p>
            </div>

            {contact.bio && <p className="text-sm text-muted-foreground px-4">{contact.bio}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button variant="default" size="sm" className="flex-1 cursor-pointer">
              <FiMessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="default" size="sm" className="flex-1 cursor-pointer">
              <FiPhone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button variant="default" size="sm" className="flex-1 cursor-pointer">
              <FiVideo className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* photos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiImage className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Photos</span>
                </div>
                <Badge variant="secondary">{photosCount}</Badge>
              </div>
              {/* audio */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <FiVolume2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm">Audio</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div> */}
              {/* Documents */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <FiFileText className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-sm">Documents</span>
                </div>
                <Badge variant="secondary">{documentCount}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start cursor-pointer text-destructive border-destructive/10 hover:bg-destructive hover:text-destructive-foreground translation-all"
            >
              <FiFlag className="w-4 h-4 mr-2" />
              Report Contact
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start cursor-pointer text-destructive border-destructive/10 hover:bg-destructive hover:text-destructive-foreground translation-all"
            >
              <FiUserX className="w-4 h-4 mr-2" />
              Block Contact
            </Button>
          </div>

          <Button
            variant="default"
            onClick={onClose}
            className="w-full bg-white text-destructive hover:bg-destructive hover:text-destructive-foreground translation-all cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
