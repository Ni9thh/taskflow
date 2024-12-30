import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  level?: number;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (parentId: string) => void;
}

export function TaskItem({ 
  task, 
  level = 0, 
  onToggleComplete, 
  onDelete, 
  onAddSubtask 
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const indentClass = {
    0: '',
    1: 'ml-6',
    2: 'ml-12',
    3: 'ml-16',
    4: 'ml-20'
  }[Math.min(level, 4)];

  const hierarchyClass = level > 0
    ? cn(
        'border-l-2',
        {
          'border-zinc-200 dark:border-zinc-700': level === 1,
          'border-zinc-300 dark:border-zinc-600': level === 2,
          'border-zinc-400 dark:border-zinc-500': level === 3,
          'border-zinc-500 dark:border-zinc-400': level >= 4
        }
      )
    : '';

  return (
    <div className="space-y-1">
      <Card 
        className={cn(
          "p-3 transition-all duration-200",
          indentClass,
          hierarchyClass,
          "hover:shadow-md",
          level > 0 && "pl-4",
          "font-mono",
          "bg-zinc-800 dark:bg-white border-zinc-700 dark:border-zinc-200"
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-2">
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-zinc-900"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            )}
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id, task.completed)}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium truncate font-mono text-white dark:text-zinc-900",
              task.completed && "line-through text-muted-foreground",
              level > 0 && "text-sm"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                "mt-1 text-sm font-mono text-zinc-400 dark:text-zinc-500",
                task.completed && "text-muted-foreground",
                level > 0 && "text-xs"
              )}>
                {task.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddSubtask(task.id)}
              className={cn(
                "h-8 w-8 hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-zinc-900",
                level >= 4 && "hidden"
              )}
              title="Add subtask"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete task"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {isExpanded && hasSubtasks && (
        <div className="space-y-1 animate-in slide-in-from-left-1">
          {task.subtasks!.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              level={level + 1}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
}