/*
  # Add news table

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `excerpt` (text, not null)
      - `content` (text, not null)
      - `image_url` (text, not null)
      - `category` (text, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `news` table
    - Add policy for public to read news
    - Add policy for authenticated users to manage news
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

-- Create policies
CREATE POLICY "Allow public read access on news"
  ON news FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow admin full access on news"
  ON news FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);