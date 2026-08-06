-- 1. Create a safe helper function to check conversation membership
-- SECURITY DEFINER bypasses RLS, avoiding infinite recursion.
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

-- Explicitly lock down the helper's EXECUTE permissions
REVOKE ALL ON FUNCTION public.check_is_participant(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_is_participant(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_is_participant(uuid) TO authenticated;


-- 2. Redefine get_or_create_direct_conversation securely
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id uuid;
  v_my_id uuid := auth.uid();
BEGIN
  IF v_my_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF v_my_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  -- Check for existing direct conversation
  SELECT cp1.conversation_id INTO v_conversation_id
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  JOIN public.conversations c ON c.id = cp1.conversation_id
  WHERE cp1.user_id = v_my_id
    AND cp2.user_id = other_user_id
    AND c.is_group = false
  LIMIT 1;

  IF v_conversation_id IS NOT NULL THEN
    RETURN v_conversation_id;
  END IF;

  -- Create new conversation
  INSERT INTO public.conversations (is_group, created_at, updated_at)
  VALUES (false, NOW(), NOW())
  RETURNING id INTO v_conversation_id;

  -- Insert participants
  INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at)
  VALUES 
    (v_conversation_id, v_my_id, NOW()),
    (v_conversation_id, other_user_id, NOW());

  RETURN v_conversation_id;
END;
$$;

-- Secure get_or_create_direct_conversation
REVOKE ALL ON FUNCTION public.get_or_create_direct_conversation(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_or_create_direct_conversation(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_direct_conversation(uuid) TO authenticated;


-- 3. Redefine send_message securely and use check_is_participant
CREATE OR REPLACE FUNCTION public.send_message(p_conversation_id uuid, p_content text, p_message_type text DEFAULT 'text')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_message_id uuid;
  v_sender_id uuid := auth.uid();
BEGIN
  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user is a participant using the centralized safe helper
  IF NOT public.check_is_participant(p_conversation_id) THEN
    RAISE EXCEPTION 'Not a participant of this conversation';
  END IF;

  INSERT INTO public.messages (conversation_id, sender_id, content, message_type, created_at)
  VALUES (p_conversation_id, v_sender_id, p_content, p_message_type, NOW())
  RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$$;

-- Secure send_message
REVOKE ALL ON FUNCTION public.send_message(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.send_message(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.send_message(uuid, text, text) TO authenticated;


-- 4. Clean up old recursive/permissive policies
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversation_participants'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.conversation_participants', pol.policyname);
    END LOOP;
    
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'messages'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.messages', pol.policyname);
    END LOOP;
    
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.conversations', pol.policyname);
    END LOOP;
END
$$;


-- 5. Apply minimal, secure RLS policies

-- ==========================================
-- CONVERSATION PARTICIPANTS POLICIES
-- ==========================================
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING ( public.check_is_participant(conversation_id) );

-- No INSERT or UPDATE policies. Controlled entirely via RPC.

CREATE POLICY "Users can delete their own participant records"
ON public.conversation_participants
FOR DELETE
USING ( user_id = auth.uid() );


-- ==========================================
-- MESSAGES POLICIES
-- ==========================================
CREATE POLICY "Users can view messages in their conversations"
ON public.messages 
FOR SELECT
USING ( public.check_is_participant(conversation_id) );

-- No direct INSERT policy since we exclusively use send_message RPC.
-- This guarantees minimal permissions and forces all inserts through our validation logic.

CREATE POLICY "Users can update their own messages"
ON public.messages 
FOR UPDATE
USING ( sender_id = auth.uid() );

-- No DELETE policy required.


-- ==========================================
-- CONVERSATIONS POLICIES
-- ==========================================
CREATE POLICY "Users can view their conversations"
ON public.conversations 
FOR SELECT
USING ( public.check_is_participant(id) );

CREATE POLICY "Users can update their conversations"
ON public.conversations 
FOR UPDATE
USING ( public.check_is_participant(id) );

-- No direct INSERT policy. Controlled entirely via RPC.
