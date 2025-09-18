import { createBrowserRouter } from 'react-router-dom';

// layouts
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import ChatLayout from '@/layouts/ChatLayout';

// pages
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import ChatWindow from '@/components/chat/ChatWindow';
import Settings from '@/pages/Settings';
import Account from '@/pages/Account';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },

      // Auth routes
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { index: true, element: <Login /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ],
      },

      // Protected routes
      {
        path: 'app',
        element: (
          <ProtectedLayout>
            <ChatLayout />
          </ProtectedLayout>
        ),
        children: [
          // chat section
          { path: 'chat/:chatId', element: <ChatWindow /> }, // /app/chat/123
          { path: 'account', element: <Account /> },
          { path: 'settings', element: <Settings /> },
          { path: 'edit', element: <Settings /> },
          { path: '*', element: <NotFound /> },
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
