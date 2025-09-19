import { createContext, FC, ReactNode, useEffect, useState } from 'react';

// lib
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
// types
import { User } from '@/types/user';
// APIS
import UserApis from '@/apis/users';

interface AuthContextType {
  userDetails: User;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddUser = (user: User) => {
    setIsAuthenticated(true);
    setUserDetails(user);
  };

  const handleRemoveUser = () => {
    setIsAuthenticated(false);
    Cookies.remove('token');
  };

  // get token from cookies & do api call to get user from server
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setLoading(false);
          return;
        }
        setLoading(true);
        const data = await UserApis.me(token);
        if (data.status === 'success') {
          handleAddUser(data.data.user);
          navigate('/app');
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const values = {
    userDetails,
    isAuthenticated,
    handleAddUser,
    handleRemoveUser,
    isLoading,
    setLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
