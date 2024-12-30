/*
  # Simplify tasks RLS policy

  1. Changes
    - Drop existing complex policies
    - Add simplified policy for task access
    - Optimize query performance
  
  2. Security
    - Maintain user data isolation
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view subtasks of owned tasks" ON tasks;

-- Create a single, simplified policy
CREATE POLICY "Users can access their tasks"
  ON tasks FOR ALL TO authenticated
  USING (
    -- User owns the task directly
    user_id = auth.uid() OR
    -- Task belongs to a folder owned by the user
    folder_id IN (
      SELECT id FROM folders 
      WHERE user_id = auth.uid()
    )
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_tasks_folder_user 
ON tasks(folder_id, user_id);