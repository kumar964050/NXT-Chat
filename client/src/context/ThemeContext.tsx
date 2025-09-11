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
  const handleChangeTheme = (theme) => {
    const root = window.document.documentElement;
    // remove existing theme
    root.classList.remove('light', 'dark');
    // remove all theme classes

    //  if selected system defaulted theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
