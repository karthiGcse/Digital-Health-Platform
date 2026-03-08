
ALTER FUNCTION public.seed_welcome_notification() SET search_path = public;

-- Insert sample notifications for existing user
INSERT INTO public.notifications (user_id, title, message, type, is_read, created_at) VALUES
  ('850aea8f-0008-43a4-81f4-be1c3f32d67c', 'Welcome to S47 Health! 🎉', 'Your account is ready. Explore AI consultations, medicine lookup, and more.', 'success', false, now() - interval '2 hours'),
  ('850aea8f-0008-43a4-81f4-be1c3f32d67c', 'Reminder: Medicine Due 💊', 'You have pending medicine reminders. Stay on track with your health.', 'warning', false, now() - interval '1 hour'),
  ('850aea8f-0008-43a4-81f4-be1c3f32d67c', 'New AI Feature Available 🤖', 'Try our new AI-powered symptom checker for instant health insights.', 'info', false, now() - interval '30 minutes');
