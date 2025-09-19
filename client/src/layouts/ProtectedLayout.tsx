import { FC, ReactNode } from 'react';
// lib
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '@/hooks/useAuth';
// components
import { Loading } from '@/components/ui/loading';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading />;

  // If not authenticated, redirect to login and remember where user wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated → render children
  return <>{children}</>;
};

export default ProtectedLayout;
