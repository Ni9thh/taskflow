import { Code2Icon } from 'lucide-react';
import { ProjectsDropdown } from './ProjectsDropdown';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function Header({ selectedProject, onSelectProject }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-white">
      <div className="flex items-center h-16 px-4 lg:px-8">
        {/* Left: Projects Dropdown */}
        <div className="flex-1">
          <ProjectsDropdown
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
          />
        </div>

        {/* Center: Logo */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Code2Icon className="h-6 w-6 text-white dark:text-zinc-900" />
          <h1 className="text-xl font-mono font-semibold text-white dark:text-zinc-900">Task Flow</h1>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex-1 flex justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
