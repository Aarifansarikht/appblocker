import React, { useState, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { ThemeConstants, ThemeConstantsProps } from '../../utils/colors';
type ThemeContextType = {
  colors: ThemeConstantsProps;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [colors, setColors] = useState(ThemeConstants.light);

  // 🔥 APPLY COLORS WHEN THEME CHANGES
  useEffect(() => {
    applySystemUI();
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    setColors(newTheme === 'light' ? ThemeConstants.light : ThemeConstants.dark);
  };

  const applySystemUI = async () => {
    try {
      // ✅ STATUS BAR
      StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(
          theme === 'light' ? '#ffffff' : '#000000'
        );

        // ✅ NAVIGATION BAR (MODERN WAY)
        await SystemNavigationBar.setNavigationColor(
          theme === 'light' ? '#ffffff' : '#000000'
        );

        await SystemNavigationBar.setBarMode(
          theme === 'light' ? 'dark' : 'light'
        );
      }
    } catch (e) {
      console.log('System UI Error:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ colors, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};