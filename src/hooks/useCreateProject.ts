import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from './useProjectStore';
import { Project } from '@/types/project';

interface CreateProjectParams {
  name: string;
  description: string;
  userId: string;
}

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addProject, updateProject } = useProjectStore();

  const createProject = async ({ name, description, userId }: CreateProjectParams): Promise<Project | null> => {
    try {
      setLoading(true);
      
      // Create an optimistic project
      const optimisticProject: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update UI immediately
      addProject(optimisticProject);

      // Make the actual API call
      const { data, error } = await supabase
        .from('folders')
        .insert([{ name, description, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Replace the optimistic project with the real data
      updateProject({ ...data, id: optimisticProject.id });
      return data;
    } catch (error) {
      toast({
        title: 'Failed to create project',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
}