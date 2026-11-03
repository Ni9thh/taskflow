import { storage, LOCAL_USER_ID } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from './useProjectStore';
import { Project } from '@/types/project';

interface CreateProjectParams {
  name: string;
  description: string;
}

export function useCreateProject() {
  const { toast } = useToast();
  const addProject = useProjectStore((state) => state.addProject);

  const createProject = ({ name, description }: CreateProjectParams): Project | null => {
    try {
      const now = new Date().toISOString();
      const project = storage.createFolder({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        user_id: LOCAL_USER_ID,
        created_at: now,
        updated_at: now,
      });

      addProject(project);
      return project;
    } catch (error) {
      toast({
        title: 'Failed to create project',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return null;
    }
  };

  return { createProject, loading: false };
}
