// src/context/AuthContext.tsx
import { createContext, FC, ReactNode, useContext, useState } from 'react';

import { User } from '@/types';

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

  const handleAddUser = (user: User) => {
    setIsAuthenticated(true);
    setUserDetails(user);
  };

  const handleRemoveUser = () => {
    setIsAuthenticated(false);
  };

  const values = {
    userDetails,
    isAuthenticated,
    handleAddUser,
    handleRemoveUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
