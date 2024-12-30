import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from './useProjectStore';

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const removeProject = useProjectStore((state) => state.removeProject);

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Optimistically update the UI
      removeProject(projectId);
      return true;
    } catch (error) {
      toast({
        title: 'Failed to delete project',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProject, loading };
}