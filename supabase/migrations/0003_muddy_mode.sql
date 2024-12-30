/*
  # Fix tasks RLS policy recursion
  
  1. Changes
    - Replace recursive policy with a more efficient one
    - Add proper user validation for nested tasks
    - Optimize query performance
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their nested tasks" ON tasks;

-- Create a new, more efficient policy
CREATE POLICY "Users can view their tasks and subtasks"
  ON tasks FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    folder_id IN (
      SELECT folder_id 
      FROM tasks parent 
      WHERE parent.id = tasks.parent_id 
      AND parent.user_id = auth.uid()
    )
  );