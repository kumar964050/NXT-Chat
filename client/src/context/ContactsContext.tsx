import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { User, Message } from '@/types';
import Cookies from 'js-cookie';
import UserApis from '@/apis/users';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

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

  // get contacts list from server
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
    if (chatId !== msg.from && msg.from !== userDetails._id) {
      toast({
        title: '📩 Message received',
        description: 'you got a new message.',
      });
    }
  };

  const values = {
    contacts,
    loading,
    handleUserWentToOffline,
    handleUpdateLastMsg,
  };

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
};

export default ContactsContext;
