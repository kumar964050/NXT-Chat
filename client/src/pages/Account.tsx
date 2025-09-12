import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FiArrowLeft, FiCamera, FiSave, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import UserApis from '@/apis/users';
import Cookies from 'js-cookie';
import { UserResponse } from '@/types';

const Account = () => {
  const navigate = useNavigate();
  const { userDetails, handleRemoveUser, handleAddUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: userDetails?.name || '',
    username: userDetails?.username || '',
    email: userDetails?.email || '',
    bio: userDetails?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      const data: UserResponse = await UserApis.updateUserDetails(token, userDetails._id, formData);
      if (data.status === 'success') {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message as string,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleUpdateProfileImage = async (file) => {
    try {
      setIsLoading(true);
      toast({
        title: 'Uploading... profile image',
        description: 'Profile Image is Updating...',
      });
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('profile', file);
      const url = `${import.meta.env.VITE_API_URL}/users/${userDetails._id}/profile-image`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        handleAddUser({
          ...userDetails,
          image: data.data.image,
        });
        toast({
          title: 'Profile Image',
          description: data.message as string,
        });
      } else {
        toast({
          title: 'profile image upload failed',
          description: data.message as string,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'profile image upload failed',
        description: error.message as string,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = Cookies.get('token');
      const data = await UserApis.deleteAccount(token, userDetails._id);
      if (data.status === 'success') {
        toast({
          title: 'Account Deleted',
          description: data.message,
        });
        setTimeout(() => {
          handleRemoveUser();
          navigate('/auth/login');
        }, 1800);
      } else {
        toast({
          title: 'Failed To delete Account',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed To delete Account',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      setIsLoading(true);

      const token = Cookies.get('token');
      const data = await UserApis.removeProfileImage(token, userDetails._id);
      if (data.status === 'success') {
        handleAddUser({
          ...userDetails,
          image: { url: null, id: null },
        });
        toast({
          title: 'Remove successfully',
          description: data.message,
        });
      } else {
        toast({
          title: 'Failed Remove ',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed Remove ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gradient-bg overflow-y-auto h-screen">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 text-foreground">
          <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>

        {/* Profile Picture */}
        <Card className="shadow-chat">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload or change your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userDetails?.image?.url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute cursor-pointer -bottom-2 -right-2 rounded-full bg-gradient-primary"
                onClick={handleImageSelect}
                disabled={isLoading}
              >
                <FiCamera className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2 space-x-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleImageSelect}
                disabled={isLoading}
              >
                Change Photo
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpdateProfileImage(file);
                  }}
                />
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer hover:opacity-70"
                onClick={handleRemoveProfileImage}
              >
                Remove Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="shadow-chat">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="min-h-20"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
                <FiSave className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security pending */}
        <Card className="shadow-chat">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-chat border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
