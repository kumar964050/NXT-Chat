import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { User } from '@/types';
import Cookies from 'js-cookie';
import UserApis from '@/apis/users';
import useAuth from '@/hooks/useAuth';

interface ContactsContextType {
  contacts: User[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: FC<ContactsProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useAuth();

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

  const values = {
    contacts,
    loading,
  };

  return <ContactsContext.Provider value={values}>{children}</ContactsContext.Provider>;
};

export default ContactsContext;
