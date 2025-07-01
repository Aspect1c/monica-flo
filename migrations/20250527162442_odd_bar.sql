/*
  # Create image likes table
  
  1. New Tables
    - `image_likes`
      - `id` (uuid, primary key)
      - `image_id` (text, required)
      - `model_name` (text, required)
      - `user_id` (text, required)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `image_likes` table
    - Add policies for users to manage their own likes
*/

-- Create the image_likes table
CREATE TABLE IF NOT EXISTS image_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id text NOT NULL,
  model_name text NOT NULL,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create a unique constraint to prevent duplicate likes
CREATE UNIQUE INDEX IF NOT EXISTS image_likes_unique_idx ON image_likes (image_id, user_id);

-- Enable Row Level Security
ALTER TABLE image_likes ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own likes
CREATE POLICY "Users can read their own likes"
  ON image_likes
  FOR SELECT
  USING (auth.uid() = user_id OR user_id = 'anonymous');

-- Create policy for users to insert their own likes
CREATE POLICY "Users can insert their own likes"
  ON image_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id = 'anonymous');

-- Create policy for users to delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON image_likes
  FOR DELETE
  USING (auth.uid() = user_id OR user_id = 'anonymous');

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS image_likes_image_id_idx ON image_likes (image_id);
CREATE INDEX IF NOT EXISTS image_likes_user_id_idx ON image_likes (user_id);