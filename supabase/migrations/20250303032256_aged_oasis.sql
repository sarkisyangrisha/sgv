/*
  # Create news table

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `news` table
    - Add policy for public to read news
    - Add policy for authenticated users to manage news
*/

-- First check if the table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'news'
  ) THEN
    -- Create news table if it doesn't exist
    CREATE TABLE news (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      excerpt text NOT NULL,
      content text NOT NULL,
      image_url text NOT NULL,
      category text NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE news ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist yet
DO $$
BEGIN
  -- Check if the public read access policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'news' AND policyname = 'Allow public read access on news'
  ) THEN
    CREATE POLICY "Allow public read access on news"
      ON news FOR SELECT TO public
      USING (true);
  END IF;

  -- Check if the admin full access policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'news' AND policyname = 'Allow admin full access on news'
  ) THEN
    CREATE POLICY "Allow admin full access on news"
      ON news FOR ALL TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;