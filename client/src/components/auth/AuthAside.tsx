import { FiLock } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const LoginSection = () => {
  return (
    <div className="max-w-md text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-elegant">
        <span className="text-4xl font-bold text-primary-foreground">N</span>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Welcome to Nxt-Chat</h1>
        <p className="text-lg  text-muted-foreground">
          Connect with friends and family through seamless messaging. Experience real-time
          conversations with advanced features.
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Real-time messaging</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Voice & video calls</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Secure & encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterSection = () => {
  return (
    <div className="max-w-md text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-elegant">
        <span className="text-4xl font-bold text-primary-foreground">N</span>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Join Nxt-Chat</h1>
        <p className="text-lg text-muted-foreground">
          Create your account and start connecting with people around the world. Experience the
          future of communication.
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Free to join & use</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Cross-platform support</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Privacy focused</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForgotSection = () => {
  return (
    <div className="max-w-md text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-elegant">
        <FiLock className="h-12 w-12 text-primary-foreground" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Secure Recovery</h1>
        <p className="text-lg text-muted-foreground">
          Your account security is our priority. We'll help you regain access safely and securely.
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Encrypted reset process</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Instant email delivery</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Secure token validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetSection = () => {
  return (
    <div className="max-w-md text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-elegant">
        <FiLock className="h-12 w-12 text-primary-foreground" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">New Beginning</h1>
        <p className="text-lg text-muted-foreground">
          Create a strong, secure password to protect your account. Choose something memorable yet
          secure.
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Minimum 8 characters</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Enhanced security</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Encrypted storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthAside = () => {
  const { pathname } = useLocation();

  const getRenderUI = () => {
    switch (pathname) {
      case '/auth/login':
        return <LoginSection />;
      case '/auth/register':
        return <RegisterSection />;
      case '/auth/forgot-password':
        return <ForgotSection />;
      case '/auth/reset-password':
        return <ResetSection />;
      default:
        return <LoginSection />;
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-full lg:w-1/2 items-center justify-center p-6 min-h-screen max-h-screen overflow-y-auto pt-5">
      {getRenderUI()}
    </div>
  );
};

export default AuthAside;
