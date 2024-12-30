import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useDeleteProject } from '@/hooks/useDeleteProject';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  userId: string;
  folderId: string | null;
  onProjectDeleted: () => void;
}

export function TaskList({ userId, folderId, onProjectDeleted }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>();
  const { tasks, createTask, deleteTask, toggleTaskCompletion } = useTasks(userId, folderId);
  const { deleteProject, loading: deleteLoading } = useDeleteProject();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderId) return;

    try {
      await createTask(newTaskTitle, newTaskDescription, selectedParentId);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsDialogOpen(false);
      setSelectedParentId(undefined);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleAddSubtask = (parentId: string) => {
    setSelectedParentId(parentId);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!folderId) return;
    const success = await deleteProject(folderId);
    if (success) {
      onProjectDeleted();
    }
  };

  if (!folderId) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-900 dark:bg-white">
        <p className="text-muted-foreground font-mono">Select a project to view tasks</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-zinc-900 dark:bg-white">
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 dark:bg-white border-b border-zinc-800 dark:border-zinc-200">
        <h2 className="text-lg font-semibold font-mono text-white dark:text-zinc-900">Tasks</h2>
        <Button
          onClick={() => {
            setSelectedParentId(undefined);
            setIsDialogOpen(true);
          }}
          className="bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 font-mono"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompletion}
              onDelete={deleteTask}
              onAddSubtask={handleAddSubtask}
            />
          ))}
        </div>
      </ScrollArea>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border-none font-mono"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="font-mono bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 dark:text-zinc-500">
              Are you sure you want to delete this project? This action cannot be undone and will remove all tasks within the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 font-mono text-white"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-mono bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
          <DialogHeader>
            <DialogTitle>
              {selectedParentId ? 'Create Subtask' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              className="font-mono bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="font-mono bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200"
            />
            <Button type="submit" className="w-full bg-white hover:bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 font-mono">
              {selectedParentId ? 'Create Subtask' : 'Create Task'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}