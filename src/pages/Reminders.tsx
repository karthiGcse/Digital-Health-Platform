import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Bell, Check, X, Trash2, Loader2, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Reminder {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  reminder_time: string;
  status: string;
  taken_count: number | null;
  missed_count: number | null;
  adherence_score: number | null;
  notes: string | null;
  user_id: string;
  created_at: string;
}

const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 12 hours', 'Weekly', 'As needed'];

const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ medicine_name: '', dosage: '', frequency: 'Once daily', reminder_time: '08:00', notes: '' });

  useEffect(() => { fetchReminders(); }, [user]);

  const fetchReminders = async () => {
    if (!user) return;
    const { data } = await supabase.from('reminders').select('*').eq('user_id', user.id).order('reminder_time');
    if (data) setReminders(data);
    setLoading(false);
  };

  const addReminder = async () => {
    if (!user || !form.medicine_name) { toast.error('Medicine name required'); return; }
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      medicine_name: form.medicine_name,
      dosage: form.dosage,
      frequency: form.frequency,
      reminder_time: form.reminder_time,
      notes: form.notes || null,
      status: 'active',
      taken_count: 0,
      missed_count: 0,
      adherence_score: 100,
    });
    if (error) { toast.error('Failed to add'); return; }
    toast.success('Reminder added');
    setDialogOpen(false);
    setForm({ medicine_name: '', dosage: '', frequency: 'Once daily', reminder_time: '08:00', notes: '' });
    fetchReminders();
  };

  const markTaken = async (r: Reminder) => {
    const newTaken = (r.taken_count || 0) + 1;
    const total = newTaken + (r.missed_count || 0);
    const score = Math.round((newTaken / total) * 100);
    await supabase.from('reminders').update({ taken_count: newTaken, adherence_score: score }).eq('id', r.id);
    setReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, taken_count: newTaken, adherence_score: score } : rem));
    toast.success(`${r.medicine_name} taken ✓`);
  };

  const markMissed = async (r: Reminder) => {
    const newMissed = (r.missed_count || 0) + 1;
    const total = (r.taken_count || 0) + newMissed;
    const score = Math.round(((r.taken_count || 0) / total) * 100);
    await supabase.from('reminders').update({ missed_count: newMissed, adherence_score: score }).eq('id', r.id);
    setReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, missed_count: newMissed, adherence_score: score } : rem));
    toast('Marked as missed', { icon: '⚠️' });
  };

  const deleteReminder = async (id: string) => {
    await supabase.from('reminders').delete().eq('id', id);
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  const toggleStatus = async (r: Reminder) => {
    const newStatus = r.status === 'active' ? 'paused' : 'active';
    await supabase.from('reminders').update({ status: newStatus }).eq('id', r.id);
    setReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, status: newStatus } : rem));
  };

  const overallAdherence = reminders.length > 0
    ? Math.round(reminders.reduce((sum, r) => sum + (r.adherence_score || 0), 0) / reminders.length)
    : 0;

  const adherenceColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-4 text-center">
            <Bell className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{reminders.filter(r => r.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-5 w-5 mx-auto mb-1 ${adherenceColor(overallAdherence)}`} />
            <p className="text-2xl font-bold">{overallAdherence}%</p>
            <p className="text-xs text-muted-foreground">Adherence</p>
          </CardContent>
        </Card>
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-4 text-center">
            <Check className="h-5 w-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{reminders.reduce((s, r) => s + (r.taken_count || 0), 0)}</p>
            <p className="text-xs text-muted-foreground">Taken</p>
          </CardContent>
        </Card>
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-4 text-center">
            <X className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-2xl font-bold">{reminders.reduce((s, r) => s + (r.missed_count || 0), 0)}</p>
            <p className="text-xs text-muted-foreground">Missed</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Medication Reminder</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Medicine Name</label>
                <Input placeholder="e.g. Metformin" value={form.medicine_name} onChange={e => setForm(p => ({ ...p, medicine_name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Dosage</label>
                  <Input placeholder="e.g. 500mg" value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time</label>
                  <Input type="time" value={form.reminder_time} onChange={e => setForm(p => ({ ...p, reminder_time: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Frequency</label>
                <Select value={form.frequency} onValueChange={v => setForm(p => ({ ...p, frequency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{frequencies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
                <Input placeholder="Take after food" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <Button onClick={addReminder} className="w-full">Add Reminder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">No Reminders</h3>
            <p className="text-sm text-muted-foreground">Set up medication reminders to stay on track.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reminders.map(r => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={`rounded-card shadow-sm ${r.status === 'paused' ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{r.medicine_name}</h3>
                          <Badge variant={r.status === 'active' ? 'default' : 'secondary'} className="text-xs cursor-pointer" onClick={() => toggleStatus(r)}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{r.dosage}</span>
                          <span>•</span>
                          <span>{r.frequency}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.reminder_time}</span>
                        </div>
                        {r.notes && <p className="text-xs text-muted-foreground mt-1">📝 {r.notes}</p>}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1">
                            <Progress value={r.adherence_score || 0} className="h-1.5" />
                          </div>
                          <span className={`text-xs font-medium ${adherenceColor(r.adherence_score || 0)}`}>{r.adherence_score || 0}%</span>
                          <span className="text-xs text-muted-foreground">({r.taken_count || 0}✓ / {r.missed_count || 0}✗)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 text-success hover:bg-success/10" onClick={() => markTaken(r)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => markMissed(r)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => deleteReminder(r.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Reminders;
