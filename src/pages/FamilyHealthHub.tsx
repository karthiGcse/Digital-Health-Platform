import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, Heart, Baby, User, Calendar, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const relationships = ['Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const avatarColors = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'teal', 'amber'];

const colorMap: Record<string, string> = {
  blue: 'from-info to-primary', green: 'from-success to-info', purple: 'from-accent to-primary',
  orange: 'from-warning to-destructive', pink: 'from-accent to-destructive', red: 'from-destructive to-warning',
  teal: 'from-success to-info', amber: 'from-warning to-accent',
};

const relationIcon = (rel: string) => {
  if (rel === 'Child' || rel === 'Baby') return <Baby className="h-5 w-5" />;
  if (rel === 'Spouse') return <Heart className="h-5 w-5" />;
  return <User className="h-5 w-5" />;
};

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string | null;
  gender: string;
  blood_group: string;
  allergies: string;
  conditions: string;
  notes: string;
  avatar_color: string;
}

const emptyMember = {
  name: '', relationship: 'Child', date_of_birth: '', gender: '', blood_group: 'Unknown',
  allergies: '', conditions: '', notes: '', avatar_color: 'blue',
};

const FamilyHealthHub = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [form, setForm] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  useEffect(() => { if (user) fetchMembers(); }, [user]);

  const fetchMembers = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('family_members').select('*').eq('user_id', user.id).order('created_at');
    if (data) setMembers(data as FamilyMember[]);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm(emptyMember); setDialogOpen(true); };
  const openEdit = (m: FamilyMember) => {
    setEditing(m);
    setForm({ name: m.name, relationship: m.relationship, date_of_birth: m.date_of_birth || '', gender: m.gender, blood_group: m.blood_group, allergies: m.allergies, conditions: m.conditions, notes: m.notes, avatar_color: m.avatar_color });
    setDialogOpen(true);
  };

  const saveMember = async () => {
    if (!user || !form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('family_members').update({ ...form, date_of_birth: form.date_of_birth || null }).eq('id', editing.id);
        toast.success('Member updated');
      } else {
        await supabase.from('family_members').insert({ ...form, date_of_birth: form.date_of_birth || null, user_id: user.id });
        toast.success('Member added');
      }
      setDialogOpen(false);
      fetchMembers();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const deleteMember = async (id: string) => {
    await supabase.from('family_members').delete().eq('id', id);
    toast.success('Member removed');
    if (selected?.id === id) setSelected(null);
    fetchMembers();
  };

  const getAge = (dob: string | null) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-6">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 80%, 55%))' }}>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">Family Health Hub</h1>
            <p className="text-primary-foreground/80 text-sm">Manage your family's health in one place</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.length} family member{members.length !== 1 ? 's' : ''}</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit' : 'Add'} Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.relationship} onValueChange={v => setForm(f => ({ ...f, relationship: v }))}>
                  <SelectTrigger><SelectValue placeholder="Relationship" /></SelectTrigger>
                  <SelectContent>{relationships.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
                <Select value={form.blood_group} onValueChange={v => setForm(f => ({ ...f, blood_group: v }))}>
                  <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
                  <SelectContent>{bloodGroups.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Allergies (comma-separated)" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} />
              <Input placeholder="Medical conditions" value={form.conditions} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} />
              <Input placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              <div>
                <p className="text-xs font-medium mb-2">Avatar Color</p>
                <div className="flex gap-2">
                  {avatarColors.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, avatar_color: c }))}
                      className={`h-7 w-7 rounded-full bg-gradient-to-br ${colorMap[c]} ${form.avatar_color === c ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                  ))}
                </div>
              </div>
              <Button onClick={saveMember} disabled={saving} className="w-full rounded-xl">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editing ? 'Update' : 'Add'} Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4"><Users className="h-8 w-8" /></div>
          <p className="font-heading font-semibold text-lg">No family members yet</p>
          <p className="text-sm mt-1">Add your family members to manage their health</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {members.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className={`group cursor-pointer overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1 ${selected?.id === m.id ? 'ring-2 ring-primary shadow-glow' : 'border-border/40'}`}
                  onClick={() => setSelected(selected?.id === m.id ? null : m)}>
                  <div className={`h-2 bg-gradient-to-r ${colorMap[m.avatar_color] || colorMap.blue}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorMap[m.avatar_color] || colorMap.blue} flex items-center justify-center text-primary-foreground shrink-0`}>
                        {relationIcon(m.relationship)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-sm truncate">{m.name}</h3>
                        <p className="text-xs text-muted-foreground">{m.relationship} {getAge(m.date_of_birth) !== null ? `• ${getAge(m.date_of_birth)} yrs` : ''}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {m.blood_group && m.blood_group !== 'Unknown' && (
                            <Badge variant="secondary" className="text-[10px] gap-1"><Droplets className="h-2.5 w-2.5" />{m.blood_group}</Badge>
                          )}
                          {m.gender && <Badge variant="outline" className="text-[10px]">{m.gender}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); openEdit(m); }}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={e => { e.stopPropagation(); deleteMember(m.id); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {selected?.id === m.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-3 pt-3 border-t border-border/30 space-y-2">
                          {m.allergies && (
                            <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                              <p className="text-[10px] font-bold text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Allergies</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{m.allergies}</p>
                            </div>
                          )}
                          {m.conditions && (
                            <div className="p-2 rounded-lg bg-warning/5 border border-warning/10">
                              <p className="text-[10px] font-bold text-warning">Conditions</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{m.conditions}</p>
                            </div>
                          )}
                          {m.date_of_birth && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" /> Born: {new Date(m.date_of_birth).toLocaleDateString()}
                            </p>
                          )}
                          {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default FamilyHealthHub;
