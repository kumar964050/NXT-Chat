import { Outlet, Navigate } from 'react-router-dom';

import AuthAside from '@/components/AuthAside';
//
import useAuth from '@/hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app" replace={true} />;
  }
  return (
    <div className="flex min-h-screen">
      {/* Section 1: Branding / Illustration */}
      <AuthAside />
      {/* Section 2: Auth Forms */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 min-h-screen max-h-screen overflow-y-auto pt-5">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
