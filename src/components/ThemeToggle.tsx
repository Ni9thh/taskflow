import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`${
        theme === 'dark' 
          ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700' 
          : 'bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-200'
      } font-mono`}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </Button>
  );
}