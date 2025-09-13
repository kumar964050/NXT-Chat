import { FC } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
// import ChatHeader from '@/components/chat/ChatHeader';
// import ChatWindow from '@/components/chat/ChatWindow';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';

const ChatLayout: FC = () => {
  const { chatId: activeChat } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { userDetails, handleRemoveUser } = useAuth();

  const handleProfile = () => {
    navigate('/app/account');
  };
  const handleSettings = () => {
    navigate('/app/settings');
  };

  return (
    <div className="h-screen min-h-screen flex">
      {/* <Sidebar /> */}
      <div className={`${pathname !== '/app' ? 'hidden md:flex' : 'flex'} flex-col h-full`}>
        {/* User Header */}
        <div className="bg-chat-header p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userDetails?.image?.url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                  {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="font-semibold text-sm text-primary-foreground truncate">
                  {userDetails?.name?.split(' ')[0] || 'User'}
                </h2>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfile}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <FiUser className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <FiSettings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveUser}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <FiLogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <ChatSidebar />
      </div>
      <Outlet />

      {pathname === '/app' && (
        <div className="hidden md:flex flex-col h-full w-full justify-center text-foreground">
          <div className="">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">N</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Welcome to Nxt-Chat</h3>
                <p className="text-muted-foreground">Select a contact to start chatting</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
