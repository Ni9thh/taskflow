/*
  # Fix task policies and enhance hierarchy support

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Add efficient indexing for task hierarchy queries
    - Ensure proper cascading for task deletions

  2. Security
    - Maintain row-level security
    - Ensure users can only access their own tasks
    - Protect task hierarchy integrity
*/

-- Drop existing complex policies
DROP POLICY IF EXISTS "Users can access their tasks" ON tasks;

-- Create simplified, non-recursive policies
CREATE POLICY "Users can manage their tasks"
  ON tasks FOR ALL TO authenticated
  USING (
    folder_id IN (
      SELECT id FROM folders 
      WHERE user_id = auth.uid()
    )
  );

-- Add composite index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_hierarchy
  ON tasks(folder_id, parent_id, user_id);

-- Ensure proper cascading
ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_parent_id_fkey,
  ADD CONSTRAINT tasks_parent_id_fkey 
    FOREIGN KEY (parent_id) 
    REFERENCES tasks(id) 
    ON DELETE CASCADE;