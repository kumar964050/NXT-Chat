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
  const [loading, setLoading] = useState(true);
  const { userDetails } = useAuth();
  const { chatId } = useParams();
  const { toast } = useToast();

  //API Call : get contacts list from server
  useEffect(() => {
    if (!userDetails) return;

    (async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        const data = await UserApis.getUsers(token);
        if (data.status === 'success') {
          setContacts(data.data.users);
        }
      } catch (error) {
        console.log(error.message as string);
      } finally {
        setLoading(false);
      }
    })();
  }, [userDetails]);

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
      prev.map((contact) => {
        if (contact._id === msg.from || contact._id === msg.to) {
          return {
            ...contact,
            lastMessage: msg,
          };
        }
        return contact;
      })
    );
    if (chatId !== msg.from && msg.from !== userDetails?._id) {
      toast({
        title: '📩 Message received',
        description: 'you got a new message.',
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

  const values = {
    contacts: sortedContacts,
    loading,
    handleUserWentToOffline,
    handleUpdateLastMsg,
  };

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
};

export default ContactsContext;
