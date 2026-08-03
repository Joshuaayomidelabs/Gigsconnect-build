-- 1. Create a safe helper function to check conversation membership
-- SECURITY DEFINER bypasses RLS, so it won't recurse.
CREATE OR REPLACE FUNCTION public.check_is_participant(c_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = c_id 
    AND user_id = auth.uid()
  );
$$;

-- 2. Drop all existing policies on conversation_participants to clear the recursive ones
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'conversation_participants'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.conversation_participants', pol.policyname);
    END LOOP;
END
$$;

-- 3. Create the new, safe policies
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING ( public.check_is_participant(conversation_id) );

CREATE POLICY "Users can insert their own participant records"
ON public.conversation_participants
FOR INSERT
WITH CHECK ( user_id = auth.uid() );

CREATE POLICY "Users can delete their own participant records"
ON public.conversation_participants
FOR DELETE
USING ( user_id = auth.uid() );

CREATE POLICY "Users can update their own participant records"
ON public.conversation_participants
FOR UPDATE
USING ( user_id = auth.uid() );
