/*
  # Add drivetrain column to cars table

  1. Changes
    - Add drivetrain column to cars table
    - Add power column to cars table
    - Add status column to cars table with enum type
*/

-- Create enum type for car status
CREATE TYPE car_status AS ENUM ('in_stock', 'on_order', 'in_transit');

-- Add new columns
DO $$ 
BEGIN
  -- Add drivetrain column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'drivetrain'
  ) THEN
    ALTER TABLE cars ADD COLUMN drivetrain text;
  END IF;

  -- Add power column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'power'
  ) THEN
    ALTER TABLE cars ADD COLUMN power text;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'status'
  ) THEN
    ALTER TABLE cars ADD COLUMN status car_status DEFAULT 'in_stock';
  END IF;
END $$;