/*
  # Add status field to cars table

  1. Changes
    - Add 'status' column to store car availability status
    - Set default value to 'in_stock'
    - Add check constraint to ensure valid status values

  2. Notes
    - Uses safe ALTER TABLE operation with IF NOT EXISTS check
    - Adds enum-like check constraint for status values
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'status'
  ) THEN
    ALTER TABLE cars ADD COLUMN status text DEFAULT 'in_stock' NOT NULL;
    ALTER TABLE cars ADD CONSTRAINT car_status_check 
      CHECK (status IN ('in_stock', 'on_order', 'in_transit'));
  END IF;
END $$;