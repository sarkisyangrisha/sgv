/*
  # Add power and drivetrain columns to cars table

  1. Changes
    - Add 'power' column for storing car power specifications
    - Add 'drivetrain' column for storing drivetrain type (FWD, RWD, AWD)

  2. Notes
    - Uses safe ALTER TABLE operations with IF NOT EXISTS checks
    - Both columns are nullable to maintain compatibility with existing data
*/

DO $$ 
BEGIN
  -- Add power column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'power'
  ) THEN
    ALTER TABLE cars ADD COLUMN power text;
  END IF;

  -- Add drivetrain column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'drivetrain'
  ) THEN
    ALTER TABLE cars ADD COLUMN drivetrain text;
  END IF;
END $$;