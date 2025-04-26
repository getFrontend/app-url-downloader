"use client";

import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only show theme toggle after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex justify-between items-center py-6">
      <div className="flex items-center space-x-2">
        <Image src="/logo-url-downloader.png" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">URL</span> Downloader
        </h1>
      </div>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
      >
        {mounted && (theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        ))}
      </button>
    </header>
  );
};

export default Header;