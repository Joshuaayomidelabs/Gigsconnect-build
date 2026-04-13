-- Run this in Supabase SQL Editor to add the new social link columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
