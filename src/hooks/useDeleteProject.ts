import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from './useProjectStore';

export function useDeleteProject() {
  const { toast } = useToast();
  const removeProject = useProjectStore((state) => state.removeProject);

  const deleteProject = (projectId: string): boolean => {
    try {
      storage.deleteFolder(projectId);
      removeProject(projectId);
      return true;
    } catch (error) {
      toast({
        title: 'Failed to delete project',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { deleteProject, loading: false };
}
