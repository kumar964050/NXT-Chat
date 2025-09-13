import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import useSocket from '@/hooks/useSocket';
import useContacts from '@/hooks/useContacts';

const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { chatId: activeChat } = useParams();
  const { userDetails } = useAuth();
  const { activeUsers } = useSocket();
  const { contacts } = useContacts();
  //   const currentUser = useSelector((state: RootState) => state.auth.user);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactClick = (contactId: string) => {
    navigate(`chat/${contactId}`);
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return 'No messages yet';

    const { type, content, from } = lastMessage;
    const isFromMe = from === userDetails._id;
    const prefix = isFromMe ? 'You: ' : '';

    switch (type) {
      case 'text':
        return `${prefix}${content}`;
      case 'image':
        return `${prefix}📷 Photo`;
      case 'video':
        return `${prefix}🎥 Video`;
      case 'audio':
        return `${prefix}🎵 Audio`;
      case 'document':
        return `${prefix}📄 Document`;
      case 'location':
        return `${prefix}📍 Location`;
      default:
        return content;
    }
  };

  return (
    <div className="w-80 bg-chat-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-foreground font-semibold">Chats</h2>
          <Button variant="ghost" size="sm">
            <FiMoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>
      {/* contacts list */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No contacts found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => handleContactClick(contact._id)}
                className={`flex items-center gap-3 p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                  activeChat === contact._id ? 'bg-secondary' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage className="object-cover" src={contact?.image?.url} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                      {contact?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {activeUsers.includes(contact._id) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-online-status border-2 border-chat-sidebar rounded-full" />
                  )}
                </div>

                {/* name and last msg time */}
                <div className="flex-1 min-w-0">
                  {/* name & msg time */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                    {contact?.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(contact.lastMessage.createdAt), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>

                  {/* last msg &  */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-40">
                      {getLastMessagePreview(contact?.lastMessage)}
                    </p>

                    <div className="flex items-center gap-2">
                      {/* {10 > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1 min-w-5 h-5 rounded-full flex items-center justify-center">
                          {10 > 99 ? '99+' : 10}
                        </Badge>
                      )} */}
                      {contact?.lastMessage?.status !== 'read' && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
