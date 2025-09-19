import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// icons
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
// hooks
import { useToast } from '@/hooks/use-toast';
// api
import AuthenticationApi from '@/apis/auth';
// types
import { BaseResponse } from '@/types/responses';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Weak password',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data: BaseResponse = await AuthenticationApi.resetPassword(token, password);
      if (data.status === 'success') {
        toast({
          title: 'Password reset successful!',
          description: data.message || 'You can now sign in with your new password.',
        });
        setTimeout(() => {
          navigate('/login');
        }, 1300);
      } else {
        toast({
          title: 'Resetting password failed',
          description: data.message as string,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: error.message as string,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-chat border-border">
        <CardHeader className="text-center space-y-4">
          <div className="lg:hidden w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
            <FiLock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Password must be at least 8 characters long</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary border-0"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-primary hover:underline text-sm"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
