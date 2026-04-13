
-- Create SECURITY DEFINER function to get user's patient ID without RLS
CREATE OR REPLACE FUNCTION public.get_user_patient_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.hospital_patients WHERE user_id = auth.uid() LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_patient_id FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_patient_id TO authenticated;

-- Drop problematic policies on hospital_patients
DROP POLICY IF EXISTS "Patients view own record" ON public.hospital_patients;
DROP POLICY IF EXISTS "Patients insert own record" ON public.hospital_patients;
DROP POLICY IF EXISTS "Patients update own record" ON public.hospital_patients;
DROP POLICY IF EXISTS "Staff can view all patients" ON public.hospital_patients;
DROP POLICY IF EXISTS "Staff can insert patients" ON public.hospital_patients;

-- Recreate without self-referencing subqueries
CREATE POLICY "Patients view own record" ON public.hospital_patients
FOR SELECT USING (
  user_id = auth.uid()
  OR family_head_id = public.get_user_patient_id()
);

CREATE POLICY "Patients insert own record" ON public.hospital_patients
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Patients update own record" ON public.hospital_patients
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Staff can view all patients" ON public.hospital_patients
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);

CREATE POLICY "Staff can insert patients" ON public.hospital_patients
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);

-- Fix policies on other tables that reference hospital_patients with subqueries
-- hospital_tokens
DROP POLICY IF EXISTS "Patients view own tokens" ON public.hospital_tokens;
CREATE POLICY "Patients view own tokens" ON public.hospital_tokens
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_orders
DROP POLICY IF EXISTS "Patients view own orders" ON public.hospital_orders;
CREATE POLICY "Patients view own orders" ON public.hospital_orders
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_visits
DROP POLICY IF EXISTS "Patients view own visits" ON public.hospital_visits;
CREATE POLICY "Patients view own visits" ON public.hospital_visits
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_bills
DROP POLICY IF EXISTS "Patients view own bills" ON public.hospital_bills;
CREATE POLICY "Patients view own bills" ON public.hospital_bills
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_loyalty
DROP POLICY IF EXISTS "Patients view own loyalty" ON public.hospital_loyalty;
CREATE POLICY "Patients view own loyalty" ON public.hospital_loyalty
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_notifications_log
DROP POLICY IF EXISTS "Patients view own notifications" ON public.hospital_notifications_log;
CREATE POLICY "Patients view own notifications" ON public.hospital_notifications_log
FOR SELECT USING (patient_id = public.get_user_patient_id());

-- hospital_slots
DROP POLICY IF EXISTS "Authenticated can book slots" ON public.hospital_slots;
CREATE POLICY "Authenticated can book slots" ON public.hospital_slots
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
  OR booked_by = public.get_user_patient_id()
);
