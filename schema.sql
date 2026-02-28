-- Sample schema for GigsConnect

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  stage_name TEXT,
  profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gigs table
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  pay TEXT NOT NULL,
  date TEXT NOT NULL,
  posted_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view gigs" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gigs" ON public.gigs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for gigs and users
ALTER PUBLICATION supabase_realtime ADD TABLE public.gigs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Sample Data
INSERT INTO public.users (id, email, full_name, stage_name, profile_complete)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'newuser@example.com', 'New User', NULL, false),
  ('22222222-2222-2222-2222-222222222222', 'alex@example.com', 'Alex Smith', 'DJ Alex', true);

INSERT INTO public.gigs (title, description, location, pay, date, posted_by)
VALUES 
  ('Lead Guitarist for Studio Session', 'Looking for an experienced lead guitarist for a 4-hour studio session recording an indie rock EP.', 'Los Angeles, CA', '$500', 'Oct 15, 2026 at 6:00 PM', '22222222-2222-2222-2222-222222222222'),
  ('Wedding Singer Needed', 'Need a versatile singer for a wedding reception. Must be able to sing pop and R&B classics.', 'New York, NY', '$800', 'Nov 2, 2026 at 4:00 PM', '22222222-2222-2222-2222-222222222222');
