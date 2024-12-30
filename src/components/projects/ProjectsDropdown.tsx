import { FolderIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useCreateProject } from '@/hooks/useCreateProject';

interface ProjectsDropdownProps {
  userId: string;
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function ProjectsDropdown({ userId, selectedProject, onSelectProject }: ProjectsDropdownProps) {
  const { projects } = useProjects(userId);
  const { createProject, loading } = useCreateProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const selectedProjectName = projects.find(p => p.id === selectedProject)?.name || 'Select Project';

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = await createProject({ name, description, userId });
    
    if (newProject) {
      onSelectProject(newProject.id);
      setName('');
      setDescription('');
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="bg-white hover:bg-zinc-100 text-zinc-900 border-white font-mono"
          >
            <FolderIcon className="h-4 w-4 mr-2" />
            {selectedProjectName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-zinc-800">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`font-mono text-white ${
                selectedProject === project.id ? 'bg-zinc-800' : ''
              } hover:bg-zinc-800`}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
          
          {projects.length > 0 && <DropdownMenuSeparator className="bg-zinc-800" />}
          
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="font-mono text-white hover:bg-zinc-800"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-mono">Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <Input
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="font-mono bg-zinc-800 text-white border-zinc-700"
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="font-mono bg-zinc-800 text-white border-zinc-700"
            />
            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-mono" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}