
CREATE TABLE public.hospital_queue_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hospital_name TEXT NOT NULL,
  department TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  queue_position INTEGER DEFAULT 1,
  estimated_wait INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hospital_queue_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own queue bookings" ON public.hospital_queue_bookings
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
