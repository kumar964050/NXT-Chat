import { FC } from 'react';
//
import { Outlet } from 'react-router-dom';

// components
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// context
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ContactsProvider } from '@/context/ContactsContext';
import { SocketProvider } from '@/context/SocketContext';

const AppLayout: FC = () => {
  return (
    <AuthProvider>
      <ContactsProvider>
        <SocketProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <main className="bg-gradient-bg text-foreground">
              <Outlet />
            </main>
          </ThemeProvider>
        </SocketProvider>
      </ContactsProvider>
    </AuthProvider>
  );
};

export default AppLayout;
