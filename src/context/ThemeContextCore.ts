import { createContext } from 'react';

export type AppTheme = 'dark' | 'light' | 'system';

export interface ThemeContextType {
  theme: AppTheme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: AppTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

