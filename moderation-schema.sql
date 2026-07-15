-- SQL Migration for Apple UGC Moderation Compliance (Guideline 1.2)

-- 1. Create the 'blocked_users' table
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(blocker_id, blocked_id),
  CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);

-- Enable RLS for blocked_users
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- Policies for blocked_users
CREATE POLICY "Users can view their own blocks."
  ON blocked_users FOR SELECT
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can insert their own blocks."
  ON blocked_users FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete their own blocks."
  ON blocked_users FOR DELETE
  USING (auth.uid() = blocker_id);


-- 2. Create the 'content_reports' table
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- 'post', 'profile', 'comment', 'gig'
  content_id UUID NOT NULL, -- ID of the reported entity
  reason TEXT NOT NULL, -- 'spam', 'harassment', 'inappropriate', 'other'
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(reporter_id, content_type, content_id)
);

-- Enable RLS for content_reports
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- Policies for content_reports
CREATE POLICY "Users can view their own reports."
  ON content_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert their own reports."
  ON content_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);


-- 3. Update SELECT policy filtering rules automatically
-- Note: Replace existing select policies or add check filters for posts, comments, and gigs

-- A. Filter rule on 'posts' SELECT policy
-- We update posts SELECT policy to exclude users whom you blocked, or who have blocked you.
CREATE POLICY "Exclude blocked users from posts SELECT" 
  ON posts FOR SELECT 
  USING (
    user_id NOT IN (
      SELECT blocked_id FROM blocked_users WHERE blocker_id = auth.uid()
    ) AND
    user_id NOT IN (
      SELECT blocker_id FROM blocked_users WHERE blocked_id = auth.uid()
    )
  );

-- B. Filter rule on 'comments' SELECT policy
CREATE POLICY "Exclude blocked users from comments SELECT"
  ON comments FOR SELECT
  USING (
    user_id NOT IN (
      SELECT blocked_id FROM blocked_users WHERE blocker_id = auth.uid()
    ) AND
    user_id NOT IN (
      SELECT blocker_id FROM blocked_users WHERE blocked_id = auth.uid()
    )
  );

-- C. Filter rule on 'gigs' SELECT policy
CREATE POLICY "Exclude blocked users from gigs SELECT"
  ON gigs FOR SELECT
  USING (
    poster_id NOT IN (
      SELECT blocked_id FROM blocked_users WHERE blocker_id = auth.uid()
    ) AND
    poster_id NOT IN (
      SELECT blocker_id FROM blocked_users WHERE blocked_id = auth.uid()
    )
  );
