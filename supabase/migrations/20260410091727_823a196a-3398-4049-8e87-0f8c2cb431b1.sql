
-- Hospital Departments
CREATE TABLE public.hospital_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  floor TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🏥',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view departments" ON public.hospital_departments FOR SELECT USING (true);

-- Hospital Doctors
CREATE TABLE public.hospital_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  department_id UUID REFERENCES public.hospital_departments(id),
  name TEXT NOT NULL,
  qualification TEXT DEFAULT '',
  speciality TEXT DEFAULT '',
  experience_years INTEGER DEFAULT 0,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'on_leave')),
  is_verified BOOLEAN DEFAULT false,
  rating_avg NUMERIC(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  room_number TEXT DEFAULT '',
  schedule JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view doctors" ON public.hospital_doctors FOR SELECT USING (true);
CREATE POLICY "Doctors manage own profile" ON public.hospital_doctors FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hospital Patients (Permanent Health ID)
CREATE TABLE public.hospital_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_id TEXT UNIQUE NOT NULL,
  user_id UUID,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  aadhaar TEXT DEFAULT '',
  email TEXT DEFAULT '',
  date_of_birth DATE,
  gender TEXT DEFAULT '',
  blood_group TEXT DEFAULT '',
  allergies TEXT DEFAULT '',
  chronic_diseases TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  family_head_id UUID REFERENCES public.hospital_patients(id),
  is_family_head BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'en',
  total_visits INTEGER DEFAULT 0,
  last_visit_date DATE,
  last_visit_summary TEXT DEFAULT '',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients view own record" ON public.hospital_patients FOR SELECT TO authenticated USING (user_id = auth.uid() OR family_head_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert own record" ON public.hospital_patients FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Patients update own record" ON public.hospital_patients FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Staff can view all patients" ON public.hospital_patients FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
CREATE POLICY "Staff can insert patients" ON public.hospital_patients FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);
CREATE INDEX idx_hospital_patients_phone ON public.hospital_patients(phone);
CREATE INDEX idx_hospital_patients_aadhaar ON public.hospital_patients(aadhaar);
CREATE INDEX idx_hospital_patients_health_id ON public.hospital_patients(health_id);

-- Hospital Slots (Online booking)
CREATE TABLE public.hospital_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.hospital_doctors(id),
  department_id UUID REFERENCES public.hospital_departments(id),
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  booked_by UUID REFERENCES public.hospital_patients(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view slots" ON public.hospital_slots FOR SELECT USING (true);
CREATE POLICY "Authenticated can book slots" ON public.hospital_slots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff can manage slots" ON public.hospital_slots FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);

-- Hospital Tokens (Daily)
CREATE TABLE public.hospital_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number INTEGER NOT NULL,
  patient_id UUID REFERENCES public.hospital_patients(id) NOT NULL,
  department_id UUID REFERENCES public.hospital_departments(id),
  doctor_id UUID REFERENCES public.hospital_doctors(id),
  token_date DATE DEFAULT CURRENT_DATE,
  qr_code TEXT DEFAULT '',
  entry_type TEXT DEFAULT 'offline' CHECK (entry_type IN ('online', 'offline')),
  is_emergency BOOLEAN DEFAULT false,
  severity TEXT DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'critical')),
  symptoms TEXT DEFAULT '',
  ai_suggested_department TEXT DEFAULT '',
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waiting', 'with_doctor', 'at_scan', 'at_lab', 'at_injection', 'at_pharmacy', 'completed', 'cancelled')),
  is_follow_up BOOLEAN DEFAULT false,
  follow_up_from UUID,
  estimated_wait_minutes INTEGER DEFAULT 0,
  queue_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all tokens" ON public.hospital_tokens FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
CREATE POLICY "Patients view own tokens" ON public.hospital_tokens FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can manage tokens" ON public.hospital_tokens FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);
CREATE INDEX idx_hospital_tokens_date ON public.hospital_tokens(token_date);
CREATE INDEX idx_hospital_tokens_status ON public.hospital_tokens(status);

-- Hospital Visits
CREATE TABLE public.hospital_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.hospital_tokens(id) NOT NULL,
  patient_id UUID REFERENCES public.hospital_patients(id) NOT NULL,
  doctor_id UUID REFERENCES public.hospital_doctors(id),
  symptoms TEXT DEFAULT '',
  diagnosis TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  prescription JSONB DEFAULT '[]',
  next_steps JSONB DEFAULT '[]',
  follow_up_days INTEGER,
  follow_up_date DATE,
  patient_rating INTEGER CHECK (patient_rating BETWEEN 1 AND 5),
  patient_feedback TEXT DEFAULT '',
  drug_warnings JSONB DEFAULT '[]',
  ai_suggestions JSONB DEFAULT '[]',
  visit_stage TEXT DEFAULT 'doctor' CHECK (visit_stage IN ('doctor', 'scan', 'lab', 'injection', 'pharmacy', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all visits" ON public.hospital_visits FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
CREATE POLICY "Patients view own visits" ON public.hospital_visits FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "Doctors manage visits" ON public.hospital_visits FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);

-- Hospital Orders (Scan/Lab/Injection/Pharmacy routing)
CREATE TABLE public.hospital_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.hospital_visits(id) NOT NULL,
  token_id UUID REFERENCES public.hospital_tokens(id) NOT NULL,
  patient_id UUID REFERENCES public.hospital_patients(id) NOT NULL,
  referring_doctor_id UUID REFERENCES public.hospital_doctors(id),
  order_type TEXT NOT NULL CHECK (order_type IN ('scan', 'lab', 'injection', 'pharmacy')),
  centre_name TEXT DEFAULT '',
  floor_location TEXT DEFAULT '',
  order_details TEXT DEFAULT '',
  medicines JSONB DEFAULT '[]',
  scan_type TEXT DEFAULT '',
  lab_tests JSONB DEFAULT '[]',
  injection_details TEXT DEFAULT '',
  result_data JSONB DEFAULT '{}',
  result_notes TEXT DEFAULT '',
  result_uploaded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'seen', 'in_progress', 'completed', 'cancelled')),
  seen_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  queue_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all orders" ON public.hospital_orders FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
CREATE POLICY "Patients view own orders" ON public.hospital_orders FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can manage orders" ON public.hospital_orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);

-- Hospital Bills
CREATE TABLE public.hospital_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.hospital_visits(id),
  token_id UUID REFERENCES public.hospital_tokens(id),
  patient_id UUID REFERENCES public.hospital_patients(id) NOT NULL,
  items JSONB DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  gst_amount NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  insurance_covered NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT DEFAULT '' CHECK (payment_method IN ('', 'cash', 'card', 'upi', 'insurance', 'wallet', 'instalment')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  insurance_claim_id TEXT DEFAULT '',
  insurance_status TEXT DEFAULT '' CHECK (insurance_status IN ('', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all bills" ON public.hospital_bills FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin', 'pharmacist'))
);
CREATE POLICY "Patients view own bills" ON public.hospital_bills FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can manage bills" ON public.hospital_bills FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'pharmacist'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'pharmacist'))
);

-- Hospital Loyalty (Points, Badges, Streaks)
CREATE TABLE public.hospital_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.hospital_patients(id) NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'follow_up', 'badge', 'spin_win', 'referral')),
  points INTEGER DEFAULT 0,
  badge_name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_loyalty ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients view own loyalty" ON public.hospital_loyalty FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can manage loyalty" ON public.hospital_loyalty FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin'))
);

-- Hospital Notification Log
CREATE TABLE public.hospital_notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.hospital_tokens(id),
  patient_id UUID REFERENCES public.hospital_patients(id),
  stage TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT DEFAULT 'app' CHECK (channel IN ('app', 'sms', 'whatsapp', 'email')),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hospital_notifications_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all notifications" ON public.hospital_notifications_log FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('doctor', 'admin'))
);
CREATE POLICY "Patients view own notifications" ON public.hospital_notifications_log FOR SELECT TO authenticated USING (
  patient_id IN (SELECT id FROM public.hospital_patients WHERE user_id = auth.uid())
);
CREATE POLICY "System can insert notifications" ON public.hospital_notifications_log FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default departments
INSERT INTO public.hospital_departments (name, floor, description, icon) VALUES
('General Medicine', 'Ground Floor', 'General physician for common ailments', '🩺'),
('Pediatrics', 'Ground Floor', 'Child and baby healthcare', '👶'),
('Gynecology', '1st Floor', 'Women health and pregnancy', '🤰'),
('Cardiology', '1st Floor', 'Heart and cardiovascular care', '❤️'),
('Orthopedics', '2nd Floor', 'Bone, joint and muscle care', '🦴'),
('Ophthalmology', '2nd Floor', 'Eye and vision care', '👁️'),
('Dentistry', '3rd Floor', 'Teeth and oral health', '🦷'),
('Psychiatry', '3rd Floor', 'Mental health and counseling', '🧠'),
('Radiology', '2nd Floor', 'X-Ray, MRI, CT Scan', '📡'),
('Laboratory', '1st Floor', 'Blood tests and lab work', '🔬'),
('Injection Centre', 'Ground Floor', 'Injections and vaccinations', '💉'),
('Pharmacy', 'Ground Floor', 'Medicine dispensing', '💊'),
('Emergency', 'Ground Floor', 'Emergency and trauma care', '🚑');

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospital_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospital_orders;

-- Function to generate Health ID
CREATE OR REPLACE FUNCTION public.generate_health_id()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.health_id IS NULL OR NEW.health_id = '' THEN
    NEW.health_id := 'HID-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(nextval('health_id_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE SEQUENCE IF NOT EXISTS health_id_seq START 1;

CREATE TRIGGER set_health_id
  BEFORE INSERT ON public.hospital_patients
  FOR EACH ROW EXECUTE FUNCTION public.generate_health_id();

-- Function to auto-increment daily token number
CREATE OR REPLACE FUNCTION public.generate_token_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  SELECT COALESCE(MAX(token_number), 0) + 1 INTO NEW.token_number
  FROM public.hospital_tokens
  WHERE token_date = CURRENT_DATE;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_token_number
  BEFORE INSERT ON public.hospital_tokens
  FOR EACH ROW EXECUTE FUNCTION public.generate_token_number();

-- Updated_at triggers
CREATE TRIGGER update_hospital_patients_updated_at BEFORE UPDATE ON public.hospital_patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hospital_doctors_updated_at BEFORE UPDATE ON public.hospital_doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hospital_tokens_updated_at BEFORE UPDATE ON public.hospital_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hospital_visits_updated_at BEFORE UPDATE ON public.hospital_visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hospital_orders_updated_at BEFORE UPDATE ON public.hospital_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
