/*
  # Fix Task RLS Policies

  1. Changes
    - Simplify task policies to use folder ownership
    - Add proper indexes for performance
    - Ensure cascading deletes work correctly

  2. Security
    - Users can only access tasks in folders they own
    - All CRUD operations are properly secured
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their tasks" ON tasks;

-- Create new simplified policies
CREATE POLICY "Users can manage tasks in their folders"
  ON tasks FOR ALL TO authenticated
  USING (
    folder_id IN (
      SELECT id FROM folders 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    folder_id IN (
      SELECT id FROM folders 
      WHERE user_id = auth.uid()
    )
  );

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_tasks_folder_user 
  ON tasks(folder_id, user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_hierarchy
  ON tasks(folder_id, parent_id);

-- Ensure proper cascading for task hierarchy
ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_parent_id_fkey,
  ADD CONSTRAINT tasks_parent_id_fkey 
    FOREIGN KEY (parent_id) 
    REFERENCES tasks(id) 
    ON DELETE CASCADE;