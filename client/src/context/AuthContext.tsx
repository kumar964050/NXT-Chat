import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { User } from '@/types';
import Cookies from 'js-cookie';
import UserApis from '@/apis/users';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  userDetails: User;
  isAuthenticated: boolean;
  handleAddUser: (user: User) => void;
  handleRemoveUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddUser = (user: User) => {
    setIsAuthenticated(true);
    setUserDetails(user);
  };

  const handleRemoveUser = () => {
    setIsAuthenticated(false);
    Cookies.remove('token');
  };

  //
  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      const data = await UserApis.me(token);
      if (data.status === 'success') {
        handleAddUser(data.data.user);
        navigate('/app');
      }
    })();
  }, [navigate]);

  const values = {
    userDetails,
    isAuthenticated,
    handleAddUser,
    handleRemoveUser,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
