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
      - `created_at` (timestamp)
      - `processed_at` (timestamp)

  2. Security
    - Enable RLS on `contact_form_submissions` table
    - Add policies for authenticated users to manage submissions
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

-- Allow authenticated users to view all submissions
CREATE POLICY "Authenticated users can view submissions" ON contact_form_submissions
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update submissions
CREATE POLICY "Authenticated users can update submissions" ON contact_form_submissions
  FOR UPDATE TO authenticated USING (true);

-- Allow anyone to insert submissions
CREATE POLICY "Anyone can submit form" ON contact_form_submissions
  FOR INSERT TO anon WITH CHECK (true);