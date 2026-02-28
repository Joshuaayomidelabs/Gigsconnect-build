-- Drop existing gigs table to recreate with new schema
DROP TABLE IF EXISTS public.gigs;

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  stage_name TEXT,
  profileComplete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gigs table with new schema
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT DEFAULT 'Music',
  event_type TEXT,
  visibility TEXT DEFAULT 'public',
  status TEXT DEFAULT 'open',
  event_date DATE,
  posted_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Create policies for users
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for gigs
CREATE POLICY "Anyone can view gigs" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gigs" ON public.gigs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own gigs" ON public.gigs FOR UPDATE USING (auth.uid() = posted_by);

-- Enable Realtime for gigs and users
ALTER PUBLICATION supabase_realtime ADD TABLE public.gigs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Sample Data
INSERT INTO public.users (id, email, name, stage_name, profileComplete)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'newuser@example.com', 'New User', NULL, false),
  ('22222222-2222-2222-2222-222222222222', 'alex@example.com', 'Alex Smith', 'DJ Alex', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gigs (title, description, location, price, currency, category, event_type, visibility, status, event_date, posted_by)
VALUES 
  ('Lead Guitarist for Studio Session', 'Looking for an experienced lead guitarist for a 4-hour studio session recording an indie rock EP.', 'Los Angeles, CA', 500, 'USD', 'Music', 'Studio Session', 'public', 'open', '2026-10-15', '22222222-2222-2222-2222-222222222222'),
  ('Wedding Singer Needed', 'Need a versatile singer for a wedding reception. Must be able to sing pop and R&B classics.', 'New York, NY', 800, 'USD', 'Music', 'Live Performance', 'public', 'open', '2026-11-02', '22222222-2222-2222-2222-222222222222');
