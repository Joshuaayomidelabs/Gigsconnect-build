import { supabase } from './src/services/supabaseClient';

async function test() {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(*)
    `)
    .order("created_at", { ascending: false });
  console.log(error);
  if (data) {
    console.log(data[0]);
  }
}
test();
