/*
  # Add images array to reviews table

  1. Changes
    - Add images array column to reviews table to support multiple images per review
  
  2. Notes
    - This maintains backward compatibility with the existing image_url column
    - The images array can store multiple image URLs
*/

-- Add images array column to reviews table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'images'
  ) THEN
    ALTER TABLE reviews ADD COLUMN images TEXT[];
  END IF;
END $$;