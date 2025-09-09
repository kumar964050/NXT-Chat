import { FC } from 'react';
//
import { Outlet } from 'react-router-dom';

// components
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// context
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const AppLayout: FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <main className=" min-h-screen bg-gradient-bg">
          <Outlet />
        </main>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppLayout;
