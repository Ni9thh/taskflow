import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TaskList } from '@/components/TaskList';

// Remember the open project between visits
const SELECTED_PROJECT_KEY = 'taskflow-selected-project';

function loadSelectedProject(): string | null {
  try {
    return localStorage.getItem(SELECTED_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(loadSelectedProject);

  useEffect(() => {
    try {
      if (selectedProject) localStorage.setItem(SELECTED_PROJECT_KEY, selectedProject);
      else localStorage.removeItem(SELECTED_PROJECT_KEY);
    } catch {
      // Storage unavailable; the selection just won't be remembered
    }
  }, [selectedProject]);

  const handleProjectDeleted = () => {
    setSelectedProject(null);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Header
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />

      <div className="flex-1 min-h-0 bg-zinc-50 dark:bg-zinc-900">
        <TaskList
          folderId={selectedProject}
          onProjectDeleted={handleProjectDeleted}
        />
      </div>
    </div>
  );
}
