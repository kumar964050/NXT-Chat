import { createBrowserRouter } from 'react-router-dom';

// layouts
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import ChatLayout from '@/layouts/ChatLayout';

// pages
import Home from '@/pages/Home';
// auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// chat
import ChatWindow from '@/components/chat/ChatWindow';
// calls
// import OutGoingCall from '@/components/call/OutGoingCall';
// import IncomingCall from '@/components/call/IncomingCall';

// settings & profile
import Settings from '@/pages/Settings';
import Account from '@/pages/Account';
// import UserProfile from '@/pages/UserProfile';
// import UpdateProfile from '@/pages/UpdateProfile';

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
          // settings
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
