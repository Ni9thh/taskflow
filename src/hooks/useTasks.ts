import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { useTaskStore } from './useTaskStore';

export function useTasks(userId: string, folderId: string | null) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { tasks, setTasks, addTask, removeTask, updateTask, updateTaskAndChildren, getTaskHierarchy } = useTaskStore();

  useEffect(() => {
    if (!folderId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('folder_id', folderId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setTasks(data || []);
      } catch (error: any) {
        toast({
          title: 'Error fetching tasks',
          description: error instanceof Error ? error.message : 'Failed to fetch tasks',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `folder_id=eq.${folderId}`,
        },
        fetchTasks
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [folderId, userId, toast, setTasks]);

  const createTask = async (title: string, description: string, parentId?: string): Promise<Task | undefined> => {
    if (!folderId || !title.trim()) return;

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim(),
        folder_id: folderId,
        user_id: userId,
        parent_id: parentId || null,
        completed: false,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;

      // Add the task to the store after successful creation
      addTask(data);

      toast({
        title: 'Task Created',
        description: 'New task has been added',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating task',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;

      // Remove the task from the store after successful deletion
      removeTask(taskId);

      toast({
        title: 'Task Deleted',
        description: 'Task and its subtasks have been removed',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting task',
        description: error instanceof Error ? error.message : 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const tasksToUpdate = updateTaskAndChildren(taskId, !completed);
      
      const { error } = await supabase
        .from('tasks')
        .upsert(
          tasksToUpdate.map(task => ({
            id: task.id,
            completed: task.completed,
            folder_id: task.folder_id,
            user_id: task.user_id,
            title: task.title,
            description: task.description,
            parent_id: task.parent_id
          }))
        );

      if (error) throw error;

      toast({
        title: 'Tasks Updated',
        description: `Tasks marked as ${!completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error: any) {
      // Revert the optimistic update
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('folder_id', folderId);
      
      setTasks(data || []);

      toast({
        title: 'Error updating tasks',
        description: error instanceof Error ? error.message : 'Failed to update tasks',
        variant: 'destructive',
      });
    }
  };

  return {
    tasks: getTaskHierarchy(),
    loading,
    createTask,
    deleteTask,
    toggleTaskCompletion,
  };
}