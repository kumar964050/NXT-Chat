import { FC } from 'react';
import { Outlet } from 'react-router-dom';
// import Sidebar from '@/components/Sidebar';
// import ChatHeader from '@/components/ChatHeader';

const ChatLayout: FC = () => {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <ChatHeader /> */}
        <main className="flex-1 overflow-auto">
          <Outlet /> {/* renders ChatList / NewChat / ChatRoom */}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
