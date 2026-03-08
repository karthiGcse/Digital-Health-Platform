import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Bell, Smartphone, Mail, MessageSquare, Pill, Calendar,
  HeartPulse, Megaphone, Moon, Save, RefreshCw, Settings2, Shield
} from 'lucide-react';

interface NotificationSettings {
  id?: string;
  user_id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  sms_phone_number: string;
  reminder_notifications: boolean;
  prescription_notifications: boolean;
  appointment_notifications: boolean;
  health_alerts: boolean;
  promotional: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const defaultSettings = (userId: string): NotificationSettings => ({
  user_id: userId,
  push_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  sms_phone_number: '',
  reminder_notifications: true,
  prescription_notifications: true,
  appointment_notifications: true,
  health_alerts: true,
  promotional: false,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
});

const NotificationSettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching notification settings:', error);
        setSettings(defaultSettings(user.id));
      } else if (data) {
        setSettings(data as unknown as NotificationSettings);
      } else {
        setSettings(defaultSettings(user.id));
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user || !settings) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      push_enabled: settings.push_enabled,
      email_enabled: settings.email_enabled,
      sms_enabled: settings.sms_enabled,
      sms_phone_number: settings.sms_phone_number,
      reminder_notifications: settings.reminder_notifications,
      prescription_notifications: settings.prescription_notifications,
      appointment_notifications: settings.appointment_notifications,
      health_alerts: settings.health_alerts,
      promotional: settings.promotional,
      quiet_hours_enabled: settings.quiet_hours_enabled,
      quiet_hours_start: settings.quiet_hours_start,
      quiet_hours_end: settings.quiet_hours_end,
    };

    const { error } = settings.id
      ? await supabase.from('notification_settings').update(payload).eq('id', settings.id)
      : await supabase.from('notification_settings').insert(payload).select().single();

    if (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Failed to save settings', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved! ✅', description: 'Your notification preferences have been updated.' });
      // Re-fetch to get the id if it was an insert
      if (!settings.id) {
        const { data } = await supabase.from('notification_settings').select('*').eq('user_id', user.id).single();
        if (data) setSettings(data as unknown as NotificationSettings);
      }
    }
    setSaving(false);
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-glow animate-pulse">
          <RefreshCw className="h-8 w-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  const channels = [
    { key: 'push_enabled' as const, label: 'Push Notifications', desc: 'Get instant alerts in your browser', icon: Bell, gradient: 'from-blue-500 to-indigo-600' },
    { key: 'email_enabled' as const, label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail, gradient: 'from-violet-500 to-purple-600' },
    { key: 'sms_enabled' as const, label: 'SMS Notifications', desc: 'Get text messages on your phone', icon: Smartphone, gradient: 'from-emerald-500 to-teal-600' },
  ];

  const categories = [
    { key: 'reminder_notifications' as const, label: 'Medicine Reminders', desc: 'Dosage and schedule alerts', icon: Pill, gradient: 'from-rose-500 to-pink-600' },
    { key: 'prescription_notifications' as const, label: 'Prescription Updates', desc: 'New prescriptions and refills', icon: MessageSquare, gradient: 'from-amber-500 to-orange-600' },
    { key: 'appointment_notifications' as const, label: 'Appointment Alerts', desc: 'Booking confirmations and reminders', icon: Calendar, gradient: 'from-cyan-500 to-blue-600' },
    { key: 'health_alerts' as const, label: 'Health Alerts', desc: 'Risk scores and health warnings', icon: HeartPulse, gradient: 'from-red-500 to-rose-600' },
    { key: 'promotional' as const, label: 'Tips & Updates', desc: 'Health tips and feature announcements', icon: Megaphone, gradient: 'from-yellow-500 to-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
      >
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0f0720 0%, #1a0a3e 30%, #1e1050 60%, #0f0720 100%)',
        }} />
        <motion.div
          animate={{ y: [-15, 15, -15], x: [-8, 8, -8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-60px] right-[10%] w-[250px] h-[250px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [10, -15, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-40px] left-[5%] w-[200px] h-[200px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)' }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 p-7 md:p-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-xl">
              <Settings2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">Notification Settings</h1>
              <p className="text-sm text-white/40 mt-1">Manage how and when you receive alerts</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delivery Channels */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Delivery Channels</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">Choose how to receive notifications</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.map((ch) => (
              <div key={ch.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${ch.gradient} flex items-center justify-center shadow-md`}>
                    <ch.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{ch.label}</p>
                    <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[ch.key] as boolean}
                  onCheckedChange={(val) => updateSetting(ch.key, val)}
                />
              </div>
            ))}

            {/* SMS Phone Number Input */}
            <AnimatePresence>
              {settings.sms_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="h-4 w-4 text-emerald-500" />
                      <Label className="text-sm font-semibold text-foreground">SMS Phone Number</Label>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-[9px] font-bold">NEW</Badge>
                    </div>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={settings.sms_phone_number}
                      onChange={(e) => updateSetting('sms_phone_number', e.target.value)}
                      className="rounded-xl bg-card border-border/50"
                    />
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Your number is encrypted and never shared
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Categories */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Notification Categories</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">Select which types of alerts you want</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md`}>
                    <cat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                    <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[cat.key] as boolean}
                  onCheckedChange={(val) => updateSetting(cat.key, val)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Moon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Quiet Hours</CardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Silence notifications during rest</p>
                </div>
              </div>
              <Switch
                checked={settings.quiet_hours_enabled}
                onCheckedChange={(val) => updateSetting('quiet_hours_enabled', val)}
              />
            </div>
          </CardHeader>
          <AnimatePresence>
            {settings.quiet_hours_enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <div className="flex-1">
                      <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">From</Label>
                      <Input
                        type="time"
                        value={settings.quiet_hours_start}
                        onChange={(e) => updateSetting('quiet_hours_start', e.target.value)}
                        className="rounded-xl bg-card border-border/50"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">To</Label>
                      <Input
                        type="time"
                        value={settings.quiet_hours_end}
                        onChange={(e) => updateSetting('quiet_hours_end', e.target.value)}
                        className="rounded-xl bg-card border-border/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 hover:opacity-90 text-white font-bold text-sm shadow-xl gap-2"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </motion.div>
    </div>
  );
};

export default NotificationSettingsPage;
