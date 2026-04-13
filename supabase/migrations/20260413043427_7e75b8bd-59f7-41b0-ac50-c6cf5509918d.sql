
-- Drop and recreate token management policies with proper casting
DROP POLICY IF EXISTS "Staff can manage tokens" ON public.hospital_tokens;
DROP POLICY IF EXISTS "Staff can view all tokens" ON public.hospital_tokens;

-- Staff (doctor/admin) can do everything with tokens
CREATE POLICY "Staff can manage tokens" ON public.hospital_tokens
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role]))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role]))
);

-- Pharmacists can view tokens
CREATE POLICY "Staff can view all tokens" ON public.hospital_tokens
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'pharmacist'::app_role)
);

-- Also fix hospital_patients insert for doctors (same casting issue)
DROP POLICY IF EXISTS "Staff can insert patients" ON public.hospital_patients;
CREATE POLICY "Staff can insert patients" ON public.hospital_patients
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role]))
);

-- Fix hospital_orders staff policy
DROP POLICY IF EXISTS "Staff can manage orders" ON public.hospital_orders;
CREATE POLICY "Staff can manage orders" ON public.hospital_orders
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role, 'pharmacist'::app_role]))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role, 'pharmacist'::app_role]))
);

-- Fix hospital_visits doctor policy
DROP POLICY IF EXISTS "Doctors manage visits" ON public.hospital_visits;
CREATE POLICY "Doctors manage visits" ON public.hospital_visits
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role]))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = ANY(ARRAY['doctor'::app_role, 'admin'::app_role]))
);
