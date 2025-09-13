import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSend, FiCheck } from 'react-icons/fi';
import { HiCheckCircle } from 'react-icons/hi';
import { isToday, isYesterday, format } from 'date-fns';
import { fileUploadResponse, Message, messageResponse, messagesResponse } from '@/types';
import useAuth from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';
import MediaUpload from './MediaUpload';
import EmojiPicker from './EmojiPicker';
import ChatHeader from './ChatHeader';

import msgAPis from '@/apis/messages';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import useSocket from '@/hooks/useSocket';
import useContacts from '@/hooks/useContacts';

// sendMessage, fetchMessages activeChat, chats
const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userDetails: currentUser } = useAuth();
  const { chatId: activeChat } = useParams();
  const { toast } = useToast();
  const { handleUpdateLastMsg } = useContacts();
  const { socket } = useSocket();
  const token = Cookies.get('token');

  // Getting msgs from server first time
  useEffect(() => {
    if (!activeChat || !currentUser) return;
    (async () => {
      const token = Cookies.get('token');
      const data: messagesResponse = await msgAPis.getMsgs(token, activeChat);
      if (data.status === 'success') {
        setMessages(data.data.messages);
      }
    })();
  }, [activeChat, currentUser]);

  // scrolling to bottom after getting msgs from server
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // file msg send also vth socket
  const handleFileUploadMsg = async (file: fileUploadResponse) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      type: file.type,
      from: currentUser._id,
      to: activeChat,
      content: newMessage || file.name,
      attachment: { id: file.id, url: file.url, name: file.name, size: file.size },
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    handleUpdateLastMsg(msg);

    const data: messageResponse = await msgAPis.addMsg(token, msg);
    if (data.status === 'success') {
      socket.emit('send-msg', msg);
      setMessages((prev) => {
        return [...prev, msg];
      });
      setNewMessage('');
      toast({
        title: 'File sent',
        description: `${file.type} has been sent successfully.`,
      });
    }
  };
  // text msg send also vth socket
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msg: Message = {
      id: crypto.randomUUID(),
      type: 'text',
      from: currentUser._id,
      to: activeChat,
      content: newMessage,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    socket.emit('send-msg', msg);

    handleUpdateLastMsg(msg);
    const data: messageResponse = await msgAPis.addMsg(token, msg);
    if (data.status === 'success') {
      setMessages((prev) => {
        return [...prev, msg];
      });
      setNewMessage('');
    }
  };
  //  share location also vth socket
  const handleLocationShareMsg = async (latitude: number, longitude: number) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      type: 'location',
      from: currentUser._id,
      to: activeChat,
      content: newMessage || 'location',
      attachment: {
        id: crypto.randomUUID(),
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        name: 'location',
        size: 0,
      },
      location: { latitude, longitude, address: 'location' },
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    handleUpdateLastMsg(msg);

    const data: messageResponse = await msgAPis.addMsg(token, msg);
    if (data.status === 'success') {
      socket.emit('send-msg', msg);
      setMessages((prev) => {
        return [...prev, msg];
      });
      setNewMessage('');
      toast({
        title: 'Location sent',
        description: 'Your location has been shared.',
      });
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = format(new Date(message?.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM dd, yyyy');
    }
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            {message.attachment && (
              <img
                src={message.attachment.url}
                alt="Shared image"
                className="max-w-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.attachment.url, '_blank')}
              />
            )}
            {message.content && <p className="text-sm break-words">{message.content}</p>}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-2">
            {message.attachment.url && (
              <video src={message.attachment.url} controls className="max-w-48 rounded-lg" />
            )}
            {message.content && <p className="text-sm break-words">{message.content}</p>}
          </div>
        );
      case 'document':
        return (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg max-w-48"
          >
            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium">📄</span>
            </div>
            <span className="text-sm truncate">{message.content}</span>
          </a>
        );
      case 'location':
        return (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg max-w-48"
          >
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${message.location.latitude},${message.location.longitude}&zoom=15&size=200x100&markers=color:red|${message.location.latitude},${message.location.longitude}&key=${import.meta.env.VITE_G_MAP_KEY}`}
              alt="map"
              className="rounded"
            />
            <span className="text-sm text-primary truncate">📍</span>
            <span className="text-sm truncate">{message.content}</span>
          </a>
        );
      default:
        return <p className="text-sm leading-normal break-words">{message.content}</p>;
    }
  };

  const renderMessageStatus = (message: Message) => {
    if (message.from !== currentUser._id) return null;

    switch (message.status) {
      case 'sending':
        return (
          <div className="w-3 h-3 border border-muted-foreground rounded-full animate-pulse" />
        );
      case 'sent':
        return <FiCheck className="w-3 h-3 text-chat-bubble-sent-foreground" />;
      case 'delivered':
        return <HiCheckCircle className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <HiCheckCircle className="w-3 h-3 text-primary" />;
      default:
        return null;
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  // get msg from socket
  useEffect(() => {
    if (!socket) return;
    socket.on('get-msg', (msg) => {
      if (activeChat === msg.from) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('get-msg');
    };
  }, [socket, activeChat]);

  return (
    <>
      <div className="flex-1 flex flex-col bg-background h-full">
        <ChatHeader />
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex justify-center mb-4">
                <div className="bg-secondary px-3 pb-1 rounded-full">
                  <span className="text-xs font-medium text-secondary-foreground">
                    {formatDateHeader(date)}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {messages.map((message) => {
                  const isFromMe = message.from === currentUser?._id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[280px] sm:max-w-sm ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* {!isFromMe && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )} */}

                        <div
                          className={`rounded-2xl px-3 py-2 shadow-bubble ${
                            isFromMe
                              ? 'bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md'
                              : 'bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md'
                          }`}
                        >
                          {renderMessageContent(message)}
                          <div
                            className={`flex items-center gap-1 mt-1 ${isFromMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <span
                              className={`text-xs ${isFromMe ? 'text-chat-bubble-sent-foreground/70' : 'text-chat-bubble-received-foreground/70'}`}
                            >
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {renderMessageStatus(message)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4 text-foreground bg-chat-input">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <MediaUpload
              handleFileUploadMsg={handleFileUploadMsg}
              handleLocationShareMsg={handleLocationShareMsg}
            />

            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-12 bg-background text-foreground"
              />
              <EmojiPicker onEmojiSelect={(emoji) => setNewMessage((prev) => prev + emoji)} />
            </div>

            <Button
              type="submit"
              size="sm"
              className="bg-gradient-primary border-0"
              disabled={!newMessage.trim()}
            >
              <FiSend className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
