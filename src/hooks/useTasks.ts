import { useEffect } from 'react';
import { storage, LOCAL_USER_ID } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { useTaskStore } from './useTaskStore';

export function useTasks(folderId: string | null) {
  const { toast } = useToast();
  const { setTasks, addTask, removeTask, updateTaskAndChildren, getTaskHierarchy } = useTaskStore();

  useEffect(() => {
    if (!folderId) {
      setTasks([]);
      return;
    }

    const load = () => setTasks(storage.listTasks(folderId));
    load();

    // Pick up changes made in other tabs
    return storage.subscribe(load);
  }, [folderId, setTasks]);

  const createTask = (title: string, description: string, parentId?: string): Task | undefined => {
    if (!folderId || !title.trim()) return;

    try {
      const task = storage.createTask({
        title: title.trim(),
        description: description.trim(),
        folder_id: folderId,
        user_id: LOCAL_USER_ID,
        parent_id: parentId || null,
        completed: false,
      });

      addTask(task);

      toast({
        title: 'Task Created',
        description: 'New task has been added',
      });

      return task;
    } catch (error) {
      toast({
        title: 'Error creating task',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTask = (taskId: string) => {
    try {
      storage.deleteTask(taskId);
      removeTask(taskId);

      toast({
        title: 'Task Deleted',
        description: 'Task and its subtasks have been removed',
      });
    } catch (error) {
      toast({
        title: 'Error deleting task',
        description: error instanceof Error ? error.message : 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const toggleTaskCompletion = (taskId: string, completed: boolean) => {
    try {
      // Completing a task also completes (or reopens) all of its subtasks
      storage.updateTasks(updateTaskAndChildren(taskId, !completed));

      toast({
        title: 'Tasks Updated',
        description: `Tasks marked as ${!completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      // Revert to what is actually saved
      if (folderId) setTasks(storage.listTasks(folderId));

      toast({
        title: 'Error updating tasks',
        description: error instanceof Error ? error.message : 'Failed to update tasks',
        variant: 'destructive',
      });
    }
  };

  return {
    tasks: getTaskHierarchy(),
    createTask,
    deleteTask,
    toggleTaskCompletion,
  };
}
