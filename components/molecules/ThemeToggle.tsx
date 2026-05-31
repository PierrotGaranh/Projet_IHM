'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-3 rounded-full bg-muted w-10 h-10" />;
  }

  return (
    <Button variant="secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-10 h-10 p-0 rounded-full">
      {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}