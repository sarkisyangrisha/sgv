/*
  # Add missing car columns

  1. Changes
    - Add power column to cars table
    - Add drivetrain column to cars table
    - Add status column to cars table with enum type
*/

-- Create car status enum type
DO $$ BEGIN
  CREATE TYPE car_status AS ENUM ('in_stock', 'on_order', 'in_transit');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS power text;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS drivetrain text;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS status car_status DEFAULT 'on_order';

-- Update existing rows to have a status
UPDATE cars SET status = 'on_order' WHERE status IS NULL;

-- Make status column required
ALTER TABLE cars ALTER COLUMN status SET NOT NULL;