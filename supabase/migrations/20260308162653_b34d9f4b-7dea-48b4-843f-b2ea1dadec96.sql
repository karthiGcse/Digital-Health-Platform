CREATE TABLE public.notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  push_enabled boolean NOT NULL DEFAULT true,
  email_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT false,
  sms_phone_number text DEFAULT '',
  reminder_notifications boolean NOT NULL DEFAULT true,
  prescription_notifications boolean NOT NULL DEFAULT true,
  appointment_notifications boolean NOT NULL DEFAULT true,
  health_alerts boolean NOT NULL DEFAULT true,
  promotional boolean NOT NULL DEFAULT false,
  quiet_hours_enabled boolean NOT NULL DEFAULT false,
  quiet_hours_start text DEFAULT '22:00',
  quiet_hours_end text DEFAULT '07:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification settings"
  ON public.notification_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON public.notification_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON public.notification_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();