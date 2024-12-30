export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  parent_id?: string | null;
  folder_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  subtasks?: Task[];
}