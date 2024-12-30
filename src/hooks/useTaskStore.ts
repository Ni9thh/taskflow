import { create } from 'zustand';
import { Task } from '@/types/task';
import { buildTaskHierarchy } from './useTaskHierarchy';

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTask: (task: Task) => void;
  updateTaskAndChildren: (taskId: string, completed: boolean) => Task[];
  getTaskHierarchy: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => {
      const isSubtask = (taskId: string): boolean => {
        const task = state.tasks.find(t => t.id === taskId);
        return task ? task.parent_id === id || isSubtask(task.parent_id!) : false;
      };
      return t.id !== id && !isSubtask(t.id);
    })
  })),
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === task.id ? task : t)
  })),
  updateTaskAndChildren: (taskId: string, completed: boolean) => {
    const state = get();
    const updatedTasks: Task[] = [];
    
    const updateTaskRecursively = (id: string) => {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return;
      
      // Update current task
      const updatedTask = { ...task, completed };
      updatedTasks.push(updatedTask);
      
      // Update all children
      const children = state.tasks.filter(t => t.parent_id === id);
      children.forEach(child => updateTaskRecursively(child.id));
    };
    
    updateTaskRecursively(taskId);
    
    set((state) => ({
      tasks: state.tasks.map(task => {
        const updatedTask = updatedTasks.find(t => t.id === task.id);
        return updatedTask || task;
      })
    }));
    
    return updatedTasks;
  },
  getTaskHierarchy: () => buildTaskHierarchy(get().tasks)
}));