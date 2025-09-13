import { useState } from 'react';
//
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// icons
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
// types
import { UserWithTokenResponse } from '@/types';
// apis
import AuthApis from '@/apis/auth';
// hooks
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('Test@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleAddUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const data: UserWithTokenResponse = await AuthApis.login({
        identity: email.toLowerCase().trim(),
        password: password,
      });

      if (data.status === 'success') {
        // adding in auth context
        Cookies.set('token', data.token, { expires: 7 });
        handleAddUser(data.data.user);

        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });

        // move app after 1.3 seconds
        setTimeout(() => {
          navigate('/app');
        }, 1300);
      } else {
        toast({
          title: 'Login failed',
          description: data.message as string,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message as string,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md shadow-chat border-border">
        <CardHeader className="text-center space-y-4">
          <div className="lg:hidden w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">N</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue chatting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Phone</Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary border-0"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
