/*
  # Fix news table migration

  1. Create news table if it doesn't exist
  2. Enable RLS on news table
  3. Create policies for public read access and admin full access only if they don't exist yet
*/

-- Create news table if it doesn't exist
CREATE TABLE IF NOT EXISTS news (
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