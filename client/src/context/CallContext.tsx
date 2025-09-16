import { createContext, ReactNode } from 'react';

interface CallContextType {
  temp: boolean;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const value: CallContextType = {
    temp: true,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export default CallContext;
