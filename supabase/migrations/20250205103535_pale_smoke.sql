/*
  # Initial schema for SGV Auto Import

  1. New Tables
    - `cars`
      - Basic car information and details
    - `car_images`
      - Gallery images for cars
    - `reviews`
      - Customer reviews with ratings
    - `faqs`
      - Frequently asked questions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  year integer NOT NULL,
  mileage text NOT NULL,
  engine text NOT NULL,
  transmission text NOT NULL,
  description text NOT NULL,
  main_image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create car images table
CREATE TABLE IF NOT EXISTS car_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  image_url text,
  source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Allow public read access on cars"
  ON cars FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access on car_images"
  ON car_images FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access on reviews"
  ON reviews FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access on faqs"
  ON faqs FOR SELECT TO public
  USING (true);

-- Policies for authenticated admin access
CREATE POLICY "Allow admin full access on cars"
  ON cars FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access on car_images"
  ON car_images FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access on reviews"
  ON reviews FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin full access on faqs"
  ON faqs FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);