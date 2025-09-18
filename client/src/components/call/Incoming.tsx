// components
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
// icons
import { FiPhone, FiPhoneOff } from 'react-icons/fi';
// hooks
import useCall from '@/hooks/useCall';
import useContacts from '@/hooks/useContacts';

const IncomingCall = () => {
  const { currentCall, answerCall, declineCall } = useCall();

  const { contacts } = useContacts();
  if (!currentCall) return null;
  const contact = contacts.find((c) => c._id === currentCall.callerId);

  return (
    <div className="fixed inset-0 bg-gradient-primary z-50 flex flex-col">
      {/* Incoming Call Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-primary-foreground p-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <Avatar className="h-25 w-25 mx-auto border-4 border-primary-foreground/20">
              <AvatarImage className="object-cover" src={contact?.image?.url} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-4xl font-bold">
                {contact?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-2 border-primary-foreground/40 animate-ping" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">{contact?.name || 'Unknown Contact'}</h2>
            <p className="text-lg text-primary-foreground/80">
              Incoming {currentCall.type} call...
            </p>
          </div>
        </div>
      </div>

      {/* Call Action Buttons */}
      <div className="p-8">
        <div className="flex items-center justify-center gap-12">
          {/* Decline Button */}
          <Button
            size="default"
            variant="destructive"
            className="rounded-full h-15 w-15 shadow-lg cursor-pointer"
            onClick={declineCall}
          >
            <FiPhoneOff className="h-8 w-8" />
          </Button>

          {/* Answer Button */}
          <Button
            size="default"
            className="rounded-full h-15 w-15 bg-accent cursor-pointer hover:bg-accent/90 shadow-lg"
            onClick={answerCall}
          >
            <FiPhone className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
