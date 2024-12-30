/*
  # Add nested tasks support
  
  1. Changes
    - Add parent_id column to tasks table to support task hierarchy
    - Add cascade delete for nested tasks
    - Update RLS policies to handle nested tasks

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own tasks and subtasks
*/

-- Add parent_id column to tasks table
ALTER TABLE tasks 
ADD COLUMN parent_id uuid REFERENCES tasks(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX tasks_parent_id_idx ON tasks(parent_id);

-- Update RLS policies to handle nested tasks
CREATE POLICY "Users can view their nested tasks"
  ON tasks FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() = (SELECT user_id FROM tasks parent WHERE parent.id = tasks.parent_id)
  );