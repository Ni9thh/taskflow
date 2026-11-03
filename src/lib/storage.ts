import { Project } from '@/types/project';
import { Task } from '@/types/task';

// All data lives in this browser's localStorage under a single key
const STORAGE_KEY = 'taskflow-data';

// There are no accounts, so every record belongs to the same local user
export const LOCAL_USER_ID = 'local';

interface StoredData {
  folders: Project[];
  tasks: Task[];
}

function read(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { folders: [], tasks: [] };
    const data = JSON.parse(raw);
    return {
      folders: Array.isArray(data.folders) ? data.folders : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
    };
  } catch {
    return { folders: [], tasks: [] };
  }
}

function write(data: StoredData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error('Could not save to browser storage. It may be full or disabled.');
  }
}

// Collect a task and every task nested beneath it
function withDescendants(tasks: Task[], rootIds: string[]): Set<string> {
  const ids = new Set(rootIds);
  let added = true;
  while (added) {
    added = false;
    for (const task of tasks) {
      if (task.parent_id && ids.has(task.parent_id) && !ids.has(task.id)) {
        ids.add(task.id);
        added = true;
      }
    }
  }
  return ids;
}

export const storage = {
  listFolders(): Project[] {
    return [...read().folders].sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  createFolder(folder: Project): Project {
    const data = read();
    data.folders.push(folder);
    write(data);
    return folder;
  },

  // Deleting a folder also deletes all of its tasks
  deleteFolder(folderId: string) {
    const data = read();
    data.folders = data.folders.filter((f) => f.id !== folderId);
    data.tasks = data.tasks.filter((t) => t.folder_id !== folderId);
    write(data);
  },

  listTasks(folderId: string): Task[] {
    return read()
      .tasks.filter((t) => t.folder_id === folderId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  createTask(fields: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'subtasks'>): Task {
    const now = new Date().toISOString();
    const task: Task = { ...fields, id: crypto.randomUUID(), created_at: now, updated_at: now };
    const data = read();
    data.tasks.push(task);
    write(data);
    return task;
  },

  // Deleting a task also deletes its subtasks
  deleteTask(taskId: string) {
    const data = read();
    const ids = withDescendants(data.tasks, [taskId]);
    data.tasks = data.tasks.filter((t) => !ids.has(t.id));
    write(data);
  },

  updateTasks(updates: Task[]) {
    const now = new Date().toISOString();
    const byId = new Map(updates.map((t) => [t.id, t]));
    const data = read();
    data.tasks = data.tasks.map((t) => {
      const update = byId.get(t.id);
      if (!update) return t;
      // Strip the derived subtasks tree before saving
      const saved: Task = { ...update, updated_at: now };
      delete saved.subtasks;
      return saved;
    });
    write(data);
  },

  // Run the callback when another tab changes the saved data
  subscribe(callback: () => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) callback();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
};
