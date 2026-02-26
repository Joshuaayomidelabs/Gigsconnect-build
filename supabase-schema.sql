-- Supabase SQL Schema for GigsConnect

-- 1. Create the 'profiles' table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  stage_name TEXT,
  email TEXT,
  phone TEXT,
  genres TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create the 'gigs' table
CREATE TABLE gigs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  pay TEXT NOT NULL,
  date_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for gigs
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

-- Policies for gigs
CREATE POLICY "Gigs are viewable by everyone." ON gigs FOR SELECT USING (true);
CREATE POLICY "Users can insert their own gigs." ON gigs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gigs." ON gigs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gigs." ON gigs FOR DELETE USING (auth.uid() = user_id);

-- 3. Create the 'applications' table
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(gig_id, applicant_id) -- Prevent multiple applications to the same gig by the same user
);

-- Enable RLS for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies for applications
CREATE POLICY "Users can view their own applications." ON applications FOR SELECT USING (auth.uid() = applicant_id);
-- Allow gig owners to view applications for their gigs
CREATE POLICY "Gig owners can view applications for their gigs." ON applications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM gigs WHERE gigs.id = applications.gig_id AND gigs.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert their own applications." ON applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
-- Allow gig owners to update application status
CREATE POLICY "Gig owners can update application status." ON applications FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM gigs WHERE gigs.id = applications.gig_id AND gigs.user_id = auth.uid()
  )
);

-- 4. Create the 'bookmarks' table (optional, for ExploreTab)
CREATE TABLE bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, gig_id)
);

-- Enable RLS for bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks." ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks." ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks." ON bookmarks FOR DELETE USING (auth.uid() = user_id);
