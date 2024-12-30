import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FolderIcon, PlusIcon } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectListProps {
  userId: string;
  selectedFolder: string | null;
  onSelectFolder: (folderId: string) => void;
}

export function FolderList({ userId, selectedFolder, onSelectFolder }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    };

    fetchProjects();

    const subscription = supabase
      .channel('folders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('folders').insert([
        {
          name: newProjectName,
          description: newProjectDescription,
          user_id: userId,
        },
      ]);
      if (error) throw error;
      setNewProjectName('');
      setNewProjectDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Textarea
                placeholder="Description (optional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
              <Button type="submit" className="w-full bg-white hover:bg-zinc-100 text-zinc-900">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1 pr-4">
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedFolder === project.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                selectedFolder === project.id 
                  ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
                  : 'text-white hover:bg-zinc-800'
              }`}
              onClick={() => onSelectFolder(project.id)}
            >
              <FolderIcon className={`mr-2 h-4 w-4 ${selectedFolder === project.id ? 'text-zinc-900' : 'text-white'}`} />
              {project.name}
            </Button>
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