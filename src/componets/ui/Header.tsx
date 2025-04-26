"use client";

import { useEffect, useState } from 'react';
import { Download, Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Mount component only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="flex justify-between items-center py-6">
        <div className="flex items-center space-x-2">
          <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">URL</span> Downloader
          </h1>
        </div>
        
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Moon className="h-5 w-5 text-gray-600" />
        </button>
      </header>
    );
  }
  
  return (
    <header className="flex justify-between items-center py-6">
      <div className="flex items-center space-x-2">
        <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">URL</span> Downloader
        </h1>
      </div>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </header>
  );
};

export default Header;