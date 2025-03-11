/*
  # Contact Form Submissions Table

  1. New Tables
    - `contact_form_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `budget` (text)
      - `city` (text)
      - `contact_method` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `processed_at` (timestamptz)

  2. Security
    - Enable RLS on `contact_form_submissions` table
    - Add policy for authenticated users to read all submissions
    - Add policy for authenticated users to update submissions
*/

-- Create contact form submissions table
CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  budget text NOT NULL,
  city text NOT NULL,
  contact_method text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read submissions"
  ON contact_form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update submissions"
  ON contact_form_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to insert submissions"
  ON contact_form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);