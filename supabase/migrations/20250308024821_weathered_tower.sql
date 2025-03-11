/*
  # Add missing car fields

  1. Changes
    - Add power column for car engine power
    - Add drivetrain column for car drive type
    - Add status column for car availability status
    - Set default values for new columns
*/

-- Add power column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'power'
  ) THEN
    ALTER TABLE cars ADD COLUMN power text;
  END IF;
END $$;

-- Add drivetrain column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'drivetrain'
  ) THEN
    ALTER TABLE cars ADD COLUMN drivetrain text;
  END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'status'
  ) THEN
    ALTER TABLE cars ADD COLUMN status text DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'on_order', 'in_transit'));
  END IF;
END $$;