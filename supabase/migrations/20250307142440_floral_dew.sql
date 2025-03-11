/*
  # Add missing car columns and status enum

  1. Changes
    - Add status enum type for car availability
    - Add power column for engine power
    - Add drivetrain column for drive type
    - Add status column with enum type
    - Set default values for new columns

  2. Security
    - No changes to RLS policies needed
*/

-- Create enum type for car status if it doesn't exist
DO $$ BEGIN
  CREATE TYPE car_status AS ENUM ('in_stock', 'on_order', 'in_transit');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add power column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'power'
  ) THEN
    ALTER TABLE cars ADD COLUMN power text;
  END IF;
END $$;

-- Add drivetrain column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'drivetrain'
  ) THEN
    ALTER TABLE cars ADD COLUMN drivetrain text;
  END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'status'
  ) THEN
    ALTER TABLE cars ADD COLUMN status car_status DEFAULT 'in_stock';
  END IF;
END $$;