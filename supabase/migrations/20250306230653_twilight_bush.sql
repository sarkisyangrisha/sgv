/*
  # Add status field to cars table

  1. Changes
    - Add status field to cars table with enum type
    - Set default value to 'in_stock'
    - Update existing records
  
  2. Notes
    - Status can be: in_stock, on_order, in_transit
*/

DO $$ BEGIN
  -- Create enum type if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_status') THEN
    CREATE TYPE car_status AS ENUM ('in_stock', 'on_order', 'in_transit');
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

-- Update existing records to have a status if null
UPDATE cars SET status = 'in_stock' WHERE status IS NULL;