-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comment likes are viewable by everyone." ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comment likes." ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comment likes." ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Add parent_id to comments for threaded replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
