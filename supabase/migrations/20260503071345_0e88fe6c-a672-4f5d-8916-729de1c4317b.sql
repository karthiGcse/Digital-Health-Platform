-- Harden handle_new_user trigger to ignore client-supplied role
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'patient'::app_role
  );
  RETURN NEW;
END;
$function$;

-- Restrict medicine_votes SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can count votes" ON public.medicine_votes;
CREATE POLICY "Auth users can count votes" ON public.medicine_votes
  FOR SELECT USING (auth.uid() IS NOT NULL);