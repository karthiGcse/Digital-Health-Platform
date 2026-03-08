
CREATE TABLE public.wearable_devices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '⌚',
  connected boolean NOT NULL DEFAULT true,
  battery integer NOT NULL DEFAULT 100,
  last_sync timestamp with time zone NOT NULL DEFAULT now(),
  sync_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.wearable_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own devices"
  ON public.wearable_devices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
