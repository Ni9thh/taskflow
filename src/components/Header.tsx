import { LogOutIcon, Code2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { ProjectsDropdown } from './ProjectsDropdown';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  user: User;
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function Header({ user, selectedProject, onSelectProject }: HeaderProps) {
  const signOut = useAuthStore((state) => state.signOut);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'You have been signed out locally, but there was an error communicating with the server.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-white">
      <div className="flex items-center h-16 px-4 lg:px-8">
        {/* Left: Projects Dropdown */}
        <div className="flex-1">
          <ProjectsDropdown
            userId={user.id}
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
          />
        </div>

        {/* Center: Logo */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Code2Icon className="h-6 w-6 text-white dark:text-zinc-900" />
          <h1 className="text-xl font-mono font-semibold text-white dark:text-zinc-900">Task Flow</h1>
        </div>

        {/* Right: Theme Toggle & Sign Out */}
        <div className="flex-1 flex justify-end gap-2">
          <ThemeToggle />
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white border-white dark:border-zinc-800 font-mono"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <LogOutIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </header>
  );
}