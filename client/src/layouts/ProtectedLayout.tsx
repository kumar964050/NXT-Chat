import { FC, ReactNode } from 'react';
// lib
import { Navigate, useLocation } from 'react-router-dom';
// components
import useAuth from '@/hooks/useAuth';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login and remember where user wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // Authenticated → render children
  return <>{children}</>;
};

export default ProtectedLayout;
