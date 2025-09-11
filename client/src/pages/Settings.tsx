import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { FiArrowLeft, FiUser, FiLogOut } from 'react-icons/fi';
import { useToast } from '../hooks/use-toast';
import useTheme from '@/hooks/useTheme';
import useAuth from '@/hooks/useAuth';

const defaultSettings = {
  theme: 'system',
  notifications: {
    messageSound: true,
    callSound: true,
    vibration: true,
    showPreview: true,
  },
  privacy: {
    lastSeen: 'everyone',
    profilePhoto: 'everyone',
    status: 'everyone',
    readReceipts: true,
  },
  autoDownload: {
    photos: true,
    videos: false,
    documents: false,
    overWifiOnly: true,
  },
};
const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);
  const { toast } = useToast();
  const { handleChangeTheme } = useTheme();
  const { handleRemoveUser } = useAuth();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings({
      ...defaultSettings,
      theme,
    });
    handleChangeTheme(theme);
    toast({
      title: 'Theme updated',
      description: `Theme changed to ${theme}`,
    });
  };

  // const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
  //   // dispatch(updateNotificationSettings({ [key]: value }));
  // };

  // const handlePrivacyChange = (key: keyof typeof settings.privacy, value: any) => {
  //   // dispatch(updatePrivacySettings({ [key]: value }));
  // };

  const handleLogout = async () => {
    try {
      handleRemoveUser();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className=" flex-1 bg-gradient-bg overflow-y-auto h-screen">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex text-foreground items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="shadow-chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiUser className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Manage your profile information and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Edit Profile</Label>
                <Button variant="outline" asChild>
                  <Link to="/account">Edit</Link>
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="royal">Royal</SelectItem>
                    <SelectItem value="emerald">Emerald</SelectItem>
                    <SelectItem value="crimson">Crimson</SelectItem>
                    <SelectItem value="midnight">Midnight</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          {/* <Card className="shadow-chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiBell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="messageSound">Message sounds</Label>
                <Switch
                  id="messageSound"
                  checked={settings.notifications.messageSound}
                  onCheckedChange={(checked) => handleNotificationChange('messageSound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="callSound">Call sounds</Label>
                <Switch
                  id="callSound"
                  checked={settings.notifications.callSound}
                  onCheckedChange={(checked) => handleNotificationChange('callSound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">Vibration</Label>
                <Switch
                  id="vibration"
                  checked={settings.notifications.vibration}
                  onCheckedChange={(checked) => handleNotificationChange('vibration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showPreview">Show preview</Label>
                <Switch
                  id="showPreview"
                  checked={settings.notifications.showPreview}
                  onCheckedChange={(checked) => handleNotificationChange('showPreview', checked)}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Privacy & Security */}
          {/* <Card className="shadow-chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiLock className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Last seen</Label>
                <Select
                  value={settings.privacy.lastSeen}
                  onValueChange={(value) => handlePrivacyChange('lastSeen', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="contacts">My contacts</SelectItem>
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Profile photo</Label>
                <Select
                  value={settings.privacy.profilePhoto}
                  onValueChange={(value) => handlePrivacyChange('profilePhoto', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="contacts">My contacts</SelectItem>
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="readReceipts">Read receipts</Label>
                <Switch
                  id="readReceipts"
                  checked={settings.privacy.readReceipts}
                  onCheckedChange={(checked) => handlePrivacyChange('readReceipts', checked)}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Storage & Data */}
          {/* <Card className="shadow-chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiDownload className="h-5 w-5" />
                Storage & Data
              </CardTitle>
              <CardDescription>Manage your storage and data usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoPhotos">Auto-download photos</Label>
                <Switch
                  id="autoPhotos"
                  checked={settings.autoDownload.photos}
                  onCheckedChange={(checked) => {
                    //     dispatch(updateAutoDownloadSettings({ photos: checked }));
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoVideos">Auto-download videos</Label>
                <Switch
                  id="autoVideos"
                  checked={settings.autoDownload.videos}
                  onCheckedChange={(checked) => {
                    // dispatch(updateAutoDownloadSettings({ videos: checked }));
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="wifiOnly">Over Wi-Fi only</Label>
                <Switch
                  id="wifiOnly"
                  checked={settings.autoDownload.overWifiOnly}
                  onCheckedChange={(checked) => {
                    // dispatch(updateAutoDownloadSettings({ overWifiOnly: checked }));
                  }}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Account Actions */}
          <Card className="shadow-chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiLogOut className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription>Account management and logout</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <FiLogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
