/*
  # Add source_url to reviews table

  1. Changes
    - Add source_url column to reviews table to store links to review sources
    - This allows masking links under text in the reviews section
*/

-- Add source_url column to reviews table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'source_url'
  ) THEN
    ALTER TABLE reviews ADD COLUMN source_url TEXT;
  END IF;
END $$;