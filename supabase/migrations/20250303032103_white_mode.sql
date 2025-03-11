/*
  # Add source_url to news table

  1. Changes
    - Add source_url column to news table to store links to news sources
    - This allows adding references to external news sources
*/

-- Add source_url column to news table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'source_url'
  ) THEN
    ALTER TABLE news ADD COLUMN source_url TEXT;
  END IF;
END $$;