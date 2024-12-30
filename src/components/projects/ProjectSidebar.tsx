import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectItem } from './ProjectItem';
import { useCreateProject } from '@/hooks/useCreateProject';

interface ProjectSidebarProps {
  userId: string;
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function ProjectSidebar({ userId, selectedProject, onSelectProject }: ProjectSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { projects } = useProjects(userId);
  const { createProject, loading } = useCreateProject();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject({ name, description, userId });
    setName('');
    setDescription('');
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white hover:bg-zinc-100 text-zinc-900">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <Input
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Button type="submit" className="w-full bg-white hover:bg-zinc-100 text-zinc-900" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isSelected={selectedProject === project.id}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
          
          {projects.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-4">
              No projects yet. Create one to get started!
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}