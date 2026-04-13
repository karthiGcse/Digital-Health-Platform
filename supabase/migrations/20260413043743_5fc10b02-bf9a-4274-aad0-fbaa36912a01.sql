
-- Recreate generate_token_number as SECURITY DEFINER to bypass RLS during trigger execution
CREATE OR REPLACE FUNCTION public.generate_token_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SELECT COALESCE(MAX(token_number), 0) + 1 INTO NEW.token_number
  FROM public.hospital_tokens
  WHERE token_date = CURRENT_DATE;
  RETURN NEW;
END;
$$;
