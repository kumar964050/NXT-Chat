import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { BaseResponse } from '@/types';
import AuthApis from '@/apis/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: BaseResponse = await AuthApis.forgotPassword(email);
      if (data.status === 'success') {
        setIsSubmitted(true);
        toast({
          title: 'Reset link sent!',
          description: 'Check your email for password reset instructions.',
        });
      } else {
        toast({
          title: 'Forgot password failed',
          description: data.message as string,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message as string,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-chat border-border">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto flex items-center justify-center">
              <FiMail className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Send Another Email
              </Button>
              <Link
                to="/auth/login"
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
  }

  return (
    <div className=" flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-chat border-border">
        <CardHeader className="text-center space-y-4">
          <div className="lg:hidden w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
            <FiLock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
            <Button
              type="submit"
              className="w-full bg-gradient-primary border-0"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="text-center">
            <Link
              to="/auth/login"
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

export default ForgotPassword;
