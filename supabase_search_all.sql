-- Supabase Migration: Full-Text Search Indexes & Unified 'search_all' Function with Moderation/Blocking Exclusions

-- 1. Create expression-based full-text GIN search index for profiles
CREATE INDEX IF NOT EXISTS profiles_fts_idx ON public.profiles USING gin (
  to_tsvector('english', coalesce(username, '') || ' ' || coalesce(full_name, '') || ' ' || coalesce(bio, ''))
);

-- 2. Create expression-based full-text GIN search index for gigs
CREATE INDEX IF NOT EXISTS gigs_fts_idx ON public.gigs USING gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- 3. Create a unified, secure database function 'search_all'
-- This function query matches both profiles and gigs using PostgreSQL full-text search and case-insensitive string parsing,
-- while strictly excluding rows from/by mutually blocked users.
CREATE OR REPLACE FUNCTION public.search_all(
  search_query TEXT,
  current_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  avatar_url TEXT,
  skills TEXT[],
  verification_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_query TEXT;
BEGIN
  -- Trim and normalize the incoming search query
  clean_query := trim(search_query);
  IF clean_query = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  -- PART A: Complete human creator profiles search (profiles who are onboarded and are not system bots or test/deleted users)
  SELECT 
    coalesce(p.user_id, p.id) AS id,
    'profile'::TEXT AS type,
    p.full_name AS title,
    p.username AS subtitle,
    p.bio AS description,
    p.avatar_url AS avatar_url,
    p.skills AS skills,
    p.verification_status AS verification_status,
    p.created_at AS created_at
  FROM public.profiles p
  WHERE 
    -- Strictly exclude mutual blocks (where current user blocked profile, or profile blocked current user)
    (current_user_id IS NULL OR (
      coalesce(p.user_id, p.id) NOT IN (
        SELECT b.blocked_id FROM public.blocked_users b WHERE b.blocker_id = current_user_id
        UNION
        SELECT b.blocker_id FROM public.blocked_users b WHERE b.blocked_id = current_user_id
      )
    ))
    -- Exclude incomplete, system, official automation, and deactivated accounts
    AND p.full_name IS NOT NULL AND trim(p.full_name) <> ''
    AND p.username IS NOT NULL AND trim(p.username) <> ''
    AND NOT (lower(p.full_name) LIKE '%gigsconnect%' OR lower(p.username) LIKE '%gigsconnect%')
    AND NOT (lower(p.full_name) LIKE '%deleted user%' OR lower(p.username) LIKE '%deleted_user%')
    -- Filter out test portfolios and developer placeholders
    AND NOT (
      lower(p.full_name) LIKE '%test%' OR lower(p.username) LIKE '%test%' OR
      lower(p.full_name) LIKE '%demo%' OR lower(p.username) LIKE '%demo%' OR
      lower(p.full_name) LIKE '%placeholder%' OR lower(p.username) LIKE '%placeholder%' OR
      lower(p.full_name) LIKE '%alex smith%' OR lower(p.full_name) LIKE '%john doe%'
    )
    -- Perform actual text query matching using Postgres full-text search combined with fallback ILIKE substring matching for typing-complete accuracy
    AND (
      to_tsvector('english', coalesce(p.username, '') || ' ' || coalesce(p.full_name, '') || ' ' || coalesce(p.bio, '')) @@ websearch_to_tsquery('english', clean_query)
      OR p.username ILIKE '%' || clean_query || '%'
      OR p.full_name ILIKE '%' || clean_query || '%'
      OR p.bio ILIKE '%' || clean_query || '%'
      -- Skill elements matching (both exact array element overlap and partial matches)
      OR p.skills @> ARRAY[clean_query]
      OR EXISTS (
        SELECT 1 FROM unnest(p.skills) s WHERE s ILIKE '%' || clean_query || '%'
      )
    )

  UNION ALL

  -- PART B: Active Gigs search
  SELECT 
    g.id AS id,
    'gig'::TEXT AS type,
    g.title AS title,
    coalesce(posters.username, '') AS subtitle,
    g.description AS description,
    coalesce(posters.avatar_url, '') AS avatar_url,
    NULL::TEXT[] AS skills,
    NULL::TEXT AS verification_status,
    g.created_at AS created_at
  FROM public.gigs g
  LEFT JOIN public.profiles posters ON g.poster_id = coalesce(posters.user_id, posters.id)
  WHERE 
    -- Strictly exclude mutual blocks (exclude gigs created by a user who has blocked the viewer, or whom the viewer has blocked)
    (current_user_id IS NULL OR (
      g.poster_id NOT IN (
        SELECT b.blocked_id FROM public.blocked_users b WHERE b.blocker_id = current_user_id
        UNION
        SELECT b.blocker_id FROM public.blocked_users b WHERE b.blocked_id = current_user_id
      )
    ))
    -- Perform actual text query matching using full-text index lookup and fallback ILIKE comparisons
    AND (
      to_tsvector('english', coalesce(g.title, '') || ' ' || coalesce(g.description, '')) @@ websearch_to_tsquery('english', clean_query)
      OR g.title ILIKE '%' || clean_query || '%'
      OR g.description ILIKE '%' || clean_query || '%'
    )
    
  ORDER BY type DESC, created_at DESC; -- Prioritizes profiles/creators first, then gigs, sorted chronologically
END;
$$;
