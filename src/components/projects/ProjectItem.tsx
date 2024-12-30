import { FolderIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDeleteProject } from '@/hooks/useDeleteProject';

interface ProjectItemProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectItem({ project, isSelected, onClick }: ProjectItemProps) {
  const { deleteProject, loading } = useDeleteProject();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProject(project.id);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className={`flex-1 justify-start ${
          isSelected 
            ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
            : 'bg-zinc-900 text-white hover:bg-zinc-800'
        }`}
        onClick={onClick}
      >
        <FolderIcon className={`mr-2 h-4 w-4 ${isSelected ? 'text-zinc-900' : 'text-white'}`} />
        {project.name}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-zinc-100 text-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-zinc-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}