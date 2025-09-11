import { useState, useRef } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { FiPaperclip, FiCamera, FiImage, FiFileText, FiMapPin, FiVideo } from 'react-icons/fi';
import { useToast } from '../../hooks/use-toast';

interface MediaUploadProps {
  chatId: string;
}

// sendMessage;
const MediaUpload = ({ chatId }: MediaUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  //   const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const handleFileUpload = (file: File, type: 'image' | 'video' | 'document' | 'audio') => {
    // Mock file upload - in real app, upload to server first
    const fileUrl = URL.createObjectURL(file);

    // dispatch(
    //   sendMessage({
    //     chatId,
    //     content: file.name,
    //     type,
    //     fileUrl,
    //   })
    // );

    toast({
      title: 'File sent',
      description: `${type} has been sent successfully.`,
    });

    setIsOpen(false);
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleVideoSelect = () => {
    videoInputRef.current?.click();
  };

  const handleDocumentSelect = () => {
    fileInputRef.current?.click();
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //   dispatch(
          //     sendMessage({
          //       chatId,
          //       content: `Location: ${latitude}, ${longitude}`,
          //       type: 'location',
          //     })
          //   );
          toast({
            title: 'Location sent',
            description: 'Your location has been shared.',
          });
          setIsOpen(false);
        },
        () => {
          toast({
            title: 'Location error',
            description: 'Unable to get your location.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Not supported',
        description: 'Geolocation is not supported by this browser.',
        variant: 'destructive',
      });
    }
  };

  const handleCameraCapture = () => {
    // Mock camera capture
    toast({
      title: 'Camera',
      description: 'Camera feature would open here.',
    });
    setIsOpen(false);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm">
            <FiPaperclip className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCameraCapture}
            >
              <FiCamera className="mr-2 h-4 w-4" />
              Camera
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleImageSelect}
            >
              <FiImage className="mr-2 h-4 w-4" />
              Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleVideoSelect}
            >
              <FiVideo className="mr-2 h-4 w-4" />
              Video
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleDocumentSelect}
            >
              <FiFileText className="mr-2 h-4 w-4" />
              Document
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLocationShare}
            >
              <FiMapPin className="mr-2 h-4 w-4" />
              Location
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'image');
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'video');
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, 'document');
        }}
      />
    </>
  );
};

export default MediaUpload;
