import { Task } from '@/types/task';

export function buildTaskHierarchy(tasks: Task[]): Task[] {
  const taskMap = new Map<string, Task>();
  const rootTasks: Task[] = [];

  // First pass: Create task map and initialize subtasks arrays
  tasks.forEach(task => {
    taskMap.set(task.id, { ...task, subtasks: [] });
  });

  // Second pass: Build hierarchy
  tasks.forEach(task => {
    const taskWithSubtasks = taskMap.get(task.id)!;
    
    if (task.parent_id && taskMap.has(task.parent_id)) {
      const parent = taskMap.get(task.parent_id)!;
      parent.subtasks!.push(taskWithSubtasks);
    } else {
      rootTasks.push(taskWithSubtasks);
    }
  });

  return rootTasks;
}