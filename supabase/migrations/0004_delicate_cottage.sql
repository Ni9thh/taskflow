/*
  # Fix nested tasks RLS policies

  1. Changes
    - Drop existing problematic policies
    - Add new optimized policies for nested tasks
    - Add proper cascade behavior
  
  2. Security
    - Ensure users can only access their own tasks and subtasks
    - Prevent unauthorized access to parent tasks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their tasks and subtasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their nested tasks" ON tasks;

-- Create new optimized policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view subtasks of owned tasks"
  ON tasks FOR SELECT TO authenticated
  USING (
    EXISTS (
      WITH RECURSIVE task_hierarchy AS (
        -- Base case: direct tasks owned by user
        SELECT id, parent_id
        FROM tasks
        WHERE user_id = auth.uid()
        
        UNION ALL
        
        -- Recursive case: subtasks of owned tasks
        SELECT t.id, t.parent_id
        FROM tasks t
        INNER JOIN task_hierarchy th ON t.parent_id = th.id
      )
      SELECT 1 FROM task_hierarchy WHERE id = tasks.id
    )
  );

-- Ensure proper cascading for nested tasks
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_parent_id_fkey,
ADD CONSTRAINT tasks_parent_id_fkey 
  FOREIGN KEY (parent_id) 
  REFERENCES tasks(id) 
  ON DELETE CASCADE;