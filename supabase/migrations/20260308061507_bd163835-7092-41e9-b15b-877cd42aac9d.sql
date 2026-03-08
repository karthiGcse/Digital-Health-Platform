
-- Create storage bucket for diagnosis images
INSERT INTO storage.buckets (id, name, public) VALUES ('diagnosis-images', 'diagnosis-images', true);

-- RLS policies for diagnosis-images bucket
CREATE POLICY "Users can upload own diagnosis images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'diagnosis-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own diagnosis images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'diagnosis-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own diagnosis images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'diagnosis-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add condition_name column to image_diagnoses for better history display
ALTER TABLE public.image_diagnoses ADD COLUMN IF NOT EXISTS condition_name text DEFAULT '';
ALTER TABLE public.image_diagnoses ADD COLUMN IF NOT EXISTS urgency text DEFAULT '';
ALTER TABLE public.image_diagnoses ADD COLUMN IF NOT EXISTS when_to_see_doctor text DEFAULT '';
ALTER TABLE public.image_diagnoses ADD COLUMN IF NOT EXISTS possible_conditions jsonb DEFAULT '[]'::jsonb;
