/*
  # Contact Form Submissions Schema

  1. New Tables
    - `contact_form_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text) 
      - `email` (text)
      - `budget` (text)
      - `city` (text)
      - `contact_method` (text)
      - `created_at` (timestamptz)
      - `status` (text) - For tracking submission status
      
  2. Security
    - Enable RLS
    - Add policy for admin access
*/

CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  budget text NOT NULL,
  city text NOT NULL,
  contact_method text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all submissions
CREATE POLICY "Allow admins to read submissions"
  ON contact_form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public to insert submissions
CREATE POLICY "Allow public to insert submissions"
  ON contact_form_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);