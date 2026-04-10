
-- Fix hospital_slots UPDATE policy - only staff and the booking patient
DROP POLICY "Authenticated can book slots" ON public.hospital_slots;
CREATE POLICY "Authenticated can book slots" ON public.hospital_slots FOR UPDATE TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
  OR booked_by IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);

-- Fix hospital_notifications_log INSERT policy
DROP POLICY "System can insert notifications" ON public.hospital_notifications_log;
CREATE POLICY "Staff can insert notifications" ON public.hospital_notifications_log FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
