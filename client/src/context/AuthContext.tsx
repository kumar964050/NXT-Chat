import { createContext, FC, ReactNode, useEffect, useState } from 'react';

// lib
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
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
  handleMuteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddUser = (user: User) => {
    setIsAuthenticated(true);
    setUserDetails(user);
  };

  const handleRemoveUser = () => {
    setIsAuthenticated(false);
    Cookies.remove('token');
  };

  const handleMuteUser = (muteId: string) => {
    const muted = userDetails?.muted ?? [];
    const index = muted.findIndex((id) => id === muteId);
    if (index !== -1) muted.splice(index, 1);
    else muted.push(muteId);
    setUserDetails({ ...userDetails, muted });
  };

  // get token from cookies & do api call to get user from server
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        const data = await UserApis.me(token);
        if (data.status === 'success') {
          handleAddUser(data.data.user);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [navigate]);

  const values = {
    userDetails,
    isAuthenticated,
    handleAddUser,
    handleRemoveUser,
    handleMuteUser,
    isLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
