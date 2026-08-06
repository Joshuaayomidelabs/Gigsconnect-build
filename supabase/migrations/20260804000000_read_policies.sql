CREATE OR REPLACE FUNCTION public.read_policies()
RETURNS TABLE(schemaname name, tablename name, policyname name, roles name[], cmd "char", qual text, with_check text)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT schemaname, tablename, policyname, roles, cmd, pg_get_expr(qual, polrelid) as qual, pg_get_expr(with_check, polrelid) as with_check
  FROM pg_policies p
  JOIN pg_policy pp ON pp.polname = p.policyname
  WHERE p.schemaname = 'public' AND p.tablename IN ('messages', 'conversations', 'conversation_participants');
$$;
