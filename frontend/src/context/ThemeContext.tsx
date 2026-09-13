// this context keeps track of whether the site is in light or dark mode
// i store the choice in localStorage so it remembers what someone picked last time they visited

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // i check localStorage first, so a returning visitor keeps their choice
  // if there is nothing saved yet, i fall back to light, since that is my default look
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('custodia-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    // tailwind's class based dark mode looks for a "dark" class on the html element
    // so i add or remove it here whenever the theme changes
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('custodia-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// this is the hook i use inside components to read or change the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme has to be called inside a ThemeProvider');
  }
  return context;
}
