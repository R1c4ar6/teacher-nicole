-- Teacher Nicole Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  features JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor Availability (recurring weekly slots)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME,
  timezone TEXT DEFAULT 'UTC',
  is_recurring BOOLEAN DEFAULT true,
  specific_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocked Dates (vacations, holidays, etc.)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES profiles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) NOT NULL,
  package_id UUID REFERENCES packages(id),
  tutor_id UUID REFERENCES profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('paypal', 'bank_transfer')),
  paypal_order_id TEXT,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  display_name TEXT,
  student_type TEXT CHECK (student_type IN ('school', 'university', 'adult', 'professional', 'child', 'parent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Settings (key-value store for bank details, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Packages: Everyone can read active packages, admins can manage all
CREATE POLICY "Anyone can read active packages" ON packages
  FOR SELECT USING (is_active = true OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage packages" ON packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Availability: Everyone can read, admins can manage
CREATE POLICY "Anyone can read availability" ON availability
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage availability" ON availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Blocked dates: Everyone can read, admins can manage
CREATE POLICY "Anyone can read blocked dates" ON blocked_dates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blocked dates" ON blocked_dates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Bookings: Students can read their own, admins can read all
CREATE POLICY "Students can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Tutors can read bookings" ON bookings
  FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Admins can read all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Testimonials: Everyone can read approved, students can create
CREATE POLICY "Anyone can read approved testimonials" ON testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can read all testimonials" ON testimonials
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can submit testimonials" ON testimonials
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Settings: Only admins can access
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Get available slots function
CREATE OR REPLACE FUNCTION get_available_slots(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  slot_date DATE,
  slot_time TIME,
  day_of_week INTEGER
) AS $$
DECLARE
  current_date DATE;
BEGIN
  current_date := start_date;
  WHILE current_date <= end_date LOOP
    FOR slot_time, day_of_week IN
      SELECT a.start_time, a.day_of_week
      FROM availability a
      WHERE a.day_of_week = EXTRACT(DOW FROM current_date)
    LOOP
      slot_date := current_date;
      RETURN NEXT;
    END LOOP;
    current_date := current_date + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional sample packages)
-- ============================================

INSERT INTO packages (name, description, price_cents, duration_minutes, features, sort_order) VALUES
  ('Trial Lesson', 'Perfect for getting started', 1500, 30, '["30-minute session", "Level assessment", "Personalized learning plan", "No commitment required"]', 1),
  ('Weekly Sessions', 'Consistent progress every week', 5500, 60, '["4 sessions per month", "60-minute lessons", "Homework & feedback", "Progress tracking", "Email support between sessions"]', 2),
  ('Intensive Package', 'Maximum growth in shortest time', 9000, 60, '["8 sessions per month", "60-minute lessons", "Priority scheduling", "Custom study materials", "WhatsApp support", "Monthly progress report"]', 3);
