
-- 1. Restrict hospital_doctors public read; require authentication
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.hospital_doctors;
CREATE POLICY "Authenticated can view doctors"
ON public.hospital_doctors FOR SELECT
TO authenticated
USING (true);

-- 2. Make diagnosis-images bucket private
UPDATE storage.buckets SET public = false WHERE id = 'diagnosis-images';

-- Storage policies scoped per-user folder
DROP POLICY IF EXISTS "Users read own diagnosis images" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own diagnosis images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own diagnosis images" ON storage.objects;

CREATE POLICY "Users read own diagnosis images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own diagnosis images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own diagnosis images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Prevent role escalation via profiles update
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only allow role changes by admins
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    ) THEN
      RAISE EXCEPTION 'Role changes are not permitted';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_change();

-- 4. Allow patients to insert their own hospital tokens
CREATE POLICY "Patients insert own tokens"
ON public.hospital_tokens FOR INSERT
TO authenticated
WITH CHECK (patient_id = public.get_user_patient_id());

-- 5. Restrict realtime broadcast/presence subscriptions to authenticated users
DROP POLICY IF EXISTS "Authenticated can use realtime" ON realtime.messages;
CREATE POLICY "Authenticated can use realtime"
ON realtime.messages FOR SELECT
TO authenticated
USING (true);

-- 6. Restrict hospital_notifications_log SELECT to authenticated only
DROP POLICY IF EXISTS "Patients view own notifications" ON public.hospital_notifications_log;
CREATE POLICY "Patients view own notifications"
ON public.hospital_notifications_log FOR SELECT
TO authenticated
USING (patient_id = public.get_user_patient_id());
