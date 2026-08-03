CREATE TABLE public.test_table_ai (id uuid default uuid_generate_v4() primary key);
-- Grant anon access to verify
ALTER TABLE public.test_table_ai ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon can read" ON public.test_table_ai FOR SELECT USING (true);
