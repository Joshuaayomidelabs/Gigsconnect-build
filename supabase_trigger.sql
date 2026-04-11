-- Function to generate a unique username
CREATE OR REPLACE FUNCTION generate_unique_username(email TEXT)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  new_username TEXT;
  suffix INTEGER := 1;
  username_exists BOOLEAN;
BEGIN
  -- Extract the part before the @ symbol
  base_username := split_part(email, '@', 1);
  
  -- Remove any non-alphanumeric characters
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g');
  
  -- Ensure it's not empty
  IF length(base_username) = 0 THEN
    base_username := 'user';
  END IF;
  
  -- Convert to lowercase
  base_username := lower(base_username);
  
  new_username := base_username;
  
  -- Loop until we find a unique username
  LOOP
    SELECT EXISTS(SELECT 1 FROM profiles WHERE username = new_username) INTO username_exists;
    
    IF NOT username_exists THEN
      RETURN new_username;
    END IF;
    
    -- If it exists, append a random number or sequential suffix
    -- Using a random number between 1000 and 9999 to reduce collisions
    new_username := base_username || floor(random() * 9000 + 1000)::int;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  generated_username TEXT;
BEGIN
  -- Generate a unique username based on the user's email
  generated_username := generate_unique_username(new.email);

  -- Insert the new profile
  -- We use ON CONFLICT DO NOTHING to prevent errors if the profile somehow already exists
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    phone,
    role,
    skills,
    country,
    city_town,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    generated_username,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'Musician'),
    -- Parse skills array if it exists, otherwise empty array
    COALESCE(
      (SELECT array_agg(x::text) FROM jsonb_array_elements_text(new.raw_user_meta_data->'skills') x),
      ARRAY[]::text[]
    ),
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'city_town',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
