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
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // index route
      { index: true, element: <Home /> },

      // Auth routes
      {
        path: '/auth',
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
        path: '/app',
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <h1>Home App</h1>,
          },
          // Chat Routes
          {
            path: 'chat',
            element: <ChatLayout />,
            children: [
              // { index: true, element: <ChatList /> }, // /chat
              // { path: 'new', element: <NewChat /> }, // /chat/new
              // { path: ':chatId', element: <ChatRoom /> }, // /chat/:chatId
            ],
          },
        ],
      },

      // not found
      { path: '*', element: <NotFound /> },
    ],
  },
]);
