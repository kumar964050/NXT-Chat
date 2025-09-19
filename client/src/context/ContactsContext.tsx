import { createContext, FC, ReactNode, useEffect, useState, useMemo } from 'react';

// lib
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

// APIS
import UserApis from '@/apis/users';
// Hooks
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// types
import { User } from '@/types/user';
import { Message } from '@/types/message';

interface ContactsContextType {
  isLoading: boolean;
  contacts: User[];
  handleUserWentToOffline: (userId: string) => void;
  handleUpdateLastMsg: (msg: Message) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: FC<ContactsProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { userDetails } = useAuth();
  const { chatId } = useParams();
  const { toast } = useToast();

  // update last seen in contacts
  const handleUserWentToOffline = (userId: string) => {
    setContacts((prev: User[]): User[] => {
      return prev.map((user) => {
        if (user._id === userId) {
          return {
            ...user,
            last_seen: new Date(),
          };
        }
        return user;
      });
    });
  };

  // update last msg in contacts
  const handleUpdateLastMsg = (msg: Message) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact._id === msg.from || contact._id === msg.to
          ? { ...contact, lastMessage: msg }
          : contact
      )
    );

    // 01 not from current chat id
    // 02 not from current logged in user
    // 03 sender should NOT be in user's muted arr list
    if (!userDetails) return;
    if (
      (chatId ? msg.from !== chatId : true) &&
      msg.from !== userDetails._id &&
      !(userDetails.muted ?? []).includes(msg.from)
    ) {
      toast({
        title: '📩 Message received',
        description: 'You got a new message.',
      });
    }
  };

  // sorting contacts based on last msg timestamp
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;

      return bTime - aTime; // newest first
    });
  }, [contacts]);

  //API Call : get contacts list from server
  // API Call : get contacts list from server
  useEffect(() => {
    if (!userDetails) return; // ⬅️ skip until auth is ready

    (async () => {
      try {
        const token = Cookies.get('token');
        setLoading(true);
        const data = await UserApis.getUsers(token);
        if (data.status === 'success') {
          setContacts(data.data.users);
        }
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userDetails]);

  const values = {
    contacts: sortedContacts,
    isLoading,
    handleUserWentToOffline,
    handleUpdateLastMsg,
  };

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
};

export default ContactsContext;
