CREATE OR REPLACE FUNCTION public.mark_conversation_read(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversation_participants
  SET last_read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND user_id = auth.uid();
END;
$$;

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
