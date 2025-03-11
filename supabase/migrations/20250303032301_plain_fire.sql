/*
  # Add source_url to reviews table

  1. Changes
    - Add `source_url` column to `reviews` table
  
  This migration adds a source_url column to the reviews table to allow storing
  links to the original review source while displaying a friendly source name.
*/

-- Add source_url column to reviews table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'source_url'
  ) THEN
    ALTER TABLE reviews ADD COLUMN source_url text;
  END IF;
END $$;