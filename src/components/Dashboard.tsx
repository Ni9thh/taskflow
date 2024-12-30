import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { TaskList } from '@/components/TaskList';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleProjectDeleted = () => {
    setSelectedProject(null);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Header 
        user={user}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />
      
      <div className="flex-1 min-h-0 bg-zinc-50 dark:bg-zinc-900">
        <TaskList
          userId={user.id}
          folderId={selectedProject}
          onProjectDeleted={handleProjectDeleted}
        />
      </div>
    </div>
  );
}