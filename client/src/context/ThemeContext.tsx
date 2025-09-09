// src/context/ThemeContext.tsx
import { createContext, FC, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
// will add more theme here

interface ThemeContextType {
  theme: Theme;
  handleChangeTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Optional: load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // save in localstorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // change theme
  const handleChangeTheme = (theme) => setTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
