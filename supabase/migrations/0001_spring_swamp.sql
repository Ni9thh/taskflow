/*
  # Initial Schema Setup for Task Management App

  1. New Tables
    - `folders` - Main task categories/folders
      - `id` (uuid, primary key)
      - `name` (text) - Folder name
      - `description` (text) - Optional folder description
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks` - Individual tasks within folders
      - `id` (uuid, primary key)
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `folder_id` (uuid) - Reference to folders
      - `user_id` (uuid) - Reference to auth.users
      - `completed` (boolean) - Task completion status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create folders table
CREATE TABLE folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  folder_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can create their own folders"
  ON folders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own folders"
  ON folders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON folders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON folders FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);