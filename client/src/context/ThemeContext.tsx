// src/context/ThemeContext.tsx
import { createContext, FC, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
// will add more theme here

interface ThemeContextType {
  theme: Theme;
  handleChangeTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const defaultTheme = localStorage.getItem('theme') as Theme;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Optional: load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // change theme &  save in localstorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'system');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // change theme
  const handleChangeTheme = (theme) => {
    setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
