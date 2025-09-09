// src/layouts/ProtectedLayout.tsx
import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const ProtectedLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  // if not authenticated then move to login page
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // if authenticated user then give access to content
  return <Outlet />;
};

export default ProtectedLayout;
