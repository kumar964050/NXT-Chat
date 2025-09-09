import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Section 1: Branding / Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center p-10 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg opacity-90">
            Sign in to continue chatting with your friends and stay connected.
          </p>
        </div>
      </div>

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
