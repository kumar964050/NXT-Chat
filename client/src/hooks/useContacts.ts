import { useContext } from 'react';
import ContactsContext from '@/context/ContactsContext';

const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) throw new Error('useContacts must be used within ContactsProvider');
  return context;
};

export default useContacts;
