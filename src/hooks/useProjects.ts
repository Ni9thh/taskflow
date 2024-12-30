import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from './useProjectStore';

export function useProjects(userId: string) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { projects, setProjects, removeProject, addProject, updateProject } = useProjectStore();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      toast({
        title: 'Error fetching projects',
        description: err instanceof Error ? err.message : 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast, setProjects]);

  useEffect(() => {
    fetchProjects();

    const channel = supabase
      .channel('folders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            removeProject(payload.old.id);
          } else if (payload.eventType === 'INSERT') {
            addProject(payload.new as Project);
          } else if (payload.eventType === 'UPDATE') {
            updateProject(payload.new as Project);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchProjects, removeProject, addProject, updateProject]);

  return { projects, loading };
}