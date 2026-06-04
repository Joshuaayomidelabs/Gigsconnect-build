-- Supabase SQL Schema for GigsConnect

-- 1. Create the 'profiles' table
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  city_town TEXT,
  genres TEXT,
  bio TEXT,
  avatar_url TEXT,
  username TEXT,
  role TEXT,
  skills TEXT[],
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  portfolio_media JSONB DEFAULT '[]'::jsonb,
  verification_status TEXT DEFAULT 'Unverified',
  verification_doc_path TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- 1.5 Create the 'user_professions' table
CREATE TABLE user_professions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profession TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, profession)
);

-- Enable RLS for user_professions
ALTER TABLE user_professions ENABLE ROW LEVEL SECURITY;

-- Policies for user_professions
CREATE POLICY "Public user_professions are viewable by everyone." ON user_professions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own professions." ON user_professions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own professions." ON user_professions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own professions." ON user_professions FOR DELETE USING (auth.uid() = user_id);

-- 2. Create the 'gigs' table
CREATE TABLE gigs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poster_id UUID REFERENCES profiles(user_id) NOT NULL,
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
CREATE POLICY "Users can insert their own gigs." ON gigs FOR INSERT WITH CHECK (auth.uid() = poster_id);
CREATE POLICY "Users can update their own gigs." ON gigs FOR UPDATE USING (auth.uid() = poster_id);
CREATE POLICY "Users can delete their own gigs." ON gigs FOR DELETE USING (auth.uid() = poster_id);

-- 3. Create the 'gig_applications' table
CREATE TABLE gig_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) NOT NULL,
  gig_owner_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'Pending' NOT NULL,
  message TEXT,
  portfolio_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(gig_id, applicant_id) -- Prevent multiple applications to the same gig by the same user
);

-- Enable RLS for gig_applications
ALTER TABLE gig_applications ENABLE ROW LEVEL SECURITY;

-- Policies for gig_applications
CREATE POLICY "Users can view their own applications." ON gig_applications FOR SELECT USING (auth.uid() = applicant_id);
-- Allow gig owners to view applications for their gigs
CREATE POLICY "Gig owners can view applications for their gigs." ON gig_applications FOR SELECT USING (auth.uid() = gig_owner_id);
CREATE POLICY "Users can insert their own applications." ON gig_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
-- Allow gig owners to update application status
CREATE POLICY "Gig owners can update application status." ON gig_applications FOR UPDATE USING (auth.uid() = gig_owner_id);

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

-- 4.5 Create the 'notifications' table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'system', -- 'gig_new', 'application_update', 'message_new', 'system'
  title TEXT DEFAULT 'Notification',
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications." ON notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users can update their own notifications." ON notifications FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Anyone can insert notifications." ON notifications FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE gig_applications;

-- 5. Storage Buckets
-- Note: These are usually created via the Supabase Dashboard, but here is the SQL for reference.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage Policies for 'avatars'
-- CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage Policies for 'portfolio'
-- CREATE POLICY "Portfolio media is publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
-- CREATE POLICY "Users can upload their own portfolio media." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND (auth.uid()::text = (storage.foldername(name))[1] OR ( (storage.foldername(name))[1] = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[2] )));
-- CREATE POLICY "Users can delete their own portfolio media." ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND (auth.uid()::text = (storage.foldername(name))[1] OR ( (storage.foldername(name))[1] = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[2] )));
