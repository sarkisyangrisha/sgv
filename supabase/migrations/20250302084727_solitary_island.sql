/*
  # Fix car_images table column name

  1. Changes
    - Rename 'url' column to 'image_url' in car_images table to match the code
*/

-- Check if the column exists with the old name and rename it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'car_images' AND column_name = 'url'
  ) THEN
    ALTER TABLE car_images RENAME COLUMN url TO image_url;
  END IF;
END $$;