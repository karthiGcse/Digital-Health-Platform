-- Create role enum
CREATE TYPE public.app_role AS ENUM ('patient', 'pharmacist', 'doctor', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'patient',
  phone TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT 'Once daily',
  reminder_time TIME NOT NULL DEFAULT '08:00',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  adherence_score INTEGER DEFAULT 0,
  missed_count INTEGER DEFAULT 0,
  taken_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prescribed_by TEXT DEFAULT '',
  clinic_name TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  diagnosis TEXT DEFAULT '',
  medicines JSONB DEFAULT '[]',
  hash TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prescriptions" ON public.prescriptions FOR ALL USING (auth.uid() = user_id);

-- Create symptom_logs table
CREATE TABLE public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT NOT NULL,
  severity TEXT DEFAULT 'mild',
  risk_score INTEGER DEFAULT 0,
  detected_symptoms JSONB DEFAULT '[]',
  possible_conditions JSONB DEFAULT '[]',
  recommended_actions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own symptom logs" ON public.symptom_logs FOR ALL USING (auth.uid() = user_id);

-- Create consultation_messages table
CREATE TABLE public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own messages" ON public.consultation_messages FOR ALL USING (auth.uid() = user_id);

-- Create medicine_votes table
CREATE TABLE public.medicine_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_id)
);

ALTER TABLE public.medicine_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own votes" ON public.medicine_votes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can count votes" ON public.medicine_votes FOR SELECT USING (true);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT DEFAULT '',
  category TEXT DEFAULT '',
  strength TEXT DEFAULT '',
  description TEXT DEFAULT '',
  dosage_adult TEXT DEFAULT '',
  dosage_child TEXT DEFAULT '',
  side_effects TEXT DEFAULT '',
  contraindications TEXT DEFAULT '',
  pregnancy_safety TEXT DEFAULT '',
  storage TEXT DEFAULT '',
  price DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT USING (true);

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'patient')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();