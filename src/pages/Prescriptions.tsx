import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Loader2, Sparkles, Trash2, Calendar, User, Building2, Pill } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Json } from '@/integrations/supabase/types';

interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

interface Prescription {
  id: string;
  prescribed_by: string | null;
  clinic_name: string | null;
  diagnosis: string | null;
  date: string | null;
  medicines: Json | null;
  status: string;
  created_at: string;
  user_id: string;
  hash: string | null;
  image_url: string | null;
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [manualForm, setManualForm] = useState({
    prescribed_by: '',
    clinic_name: '',
    diagnosis: '',
    date: new Date().toISOString().split('T')[0],
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  });

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const fetchPrescriptions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPrescriptions(data);
    setLoading(false);
  };

  const addManualMedicine = () => {
    setManualForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    }));
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    setManualForm(prev => ({
      ...prev,
      medicines: prev.medicines.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const removeMedicine = (index: number) => {
    setManualForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const saveManual = async () => {
    if (!user || !manualForm.medicines[0]?.name) {
      toast.error('Add at least one medicine');
      return;
    }
    const { error } = await supabase.from('prescriptions').insert({
      user_id: user.id,
      prescribed_by: manualForm.prescribed_by || null,
      clinic_name: manualForm.clinic_name || null,
      diagnosis: manualForm.diagnosis || null,
      date: manualForm.date || null,
      medicines: manualForm.medicines.filter(m => m.name) as unknown as Json,
      status: 'active',
    });
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Prescription saved');
    setDialogOpen(false);
    setManualForm({ prescribed_by: '', clinic_name: '', diagnosis: '', date: new Date().toISOString().split('T')[0], medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] });
    fetchPrescriptions();
  };

  const parseWithAI = async () => {
    if (!ocrText.trim()) { toast.error('Paste prescription text'); return; }
    setOcrLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('prescription-ocr', {
        body: { prescription_text: ocrText },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setManualForm({
        prescribed_by: data.prescribed_by || '',
        clinic_name: data.clinic_name || '',
        diagnosis: data.diagnosis || '',
        date: data.date || new Date().toISOString().split('T')[0],
        medicines: data.medicines?.length ? data.medicines : [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      });
      toast.success('Prescription parsed! Review and save.');
    } catch (e: any) {
      toast.error(e.message || 'AI parsing failed');
    } finally {
      setOcrLoading(false);
    }
  };

  const deletePrescription = async (id: string) => {
    await supabase.from('prescriptions').delete().eq('id', id);
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast.success('Prescription deleted');
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'active' ? 'completed' : 'active';
    await supabase.from('prescriptions').update({ status: newStatus }).eq('id', id);
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const getMedicines = (m: Json | null): PrescriptionMedicine[] => {
    if (!m || !Array.isArray(m)) return [];
    return m as unknown as PrescriptionMedicine[];
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Prescription</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Prescription</DialogTitle></DialogHeader>
            <Tabs defaultValue="ai">
              <TabsList className="w-full">
                <TabsTrigger value="ai" className="flex-1"><Sparkles className="h-3.5 w-3.5 mr-1" /> AI Parse</TabsTrigger>
                <TabsTrigger value="manual" className="flex-1"><FileText className="h-3.5 w-3.5 mr-1" /> Manual</TabsTrigger>
              </TabsList>
              <TabsContent value="ai" className="space-y-4 mt-4">
                <Textarea placeholder="Paste or type prescription text here... e.g. Dr. Sharma, Apollo Clinic, Tab Amoxicillin 500mg TDS x 5 days, Tab Paracetamol 650mg SOS" value={ocrText} onChange={e => setOcrText(e.target.value)} rows={6} />
                <Button onClick={parseWithAI} disabled={ocrLoading} className="w-full">
                  {ocrLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Parsing...</> : <><Sparkles className="h-4 w-4 mr-2" /> Parse with AI</>}
                </Button>
              </TabsContent>
              <TabsContent value="manual" className="mt-4" />
            </Tabs>

            <div className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Doctor</label>
                  <Input placeholder="Dr. Name" value={manualForm.prescribed_by} onChange={e => setManualForm(p => ({ ...p, prescribed_by: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Clinic</label>
                  <Input placeholder="Clinic name" value={manualForm.clinic_name} onChange={e => setManualForm(p => ({ ...p, clinic_name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Diagnosis</label>
                  <Input placeholder="Condition" value={manualForm.diagnosis} onChange={e => setManualForm(p => ({ ...p, diagnosis: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input type="date" value={manualForm.date} onChange={e => setManualForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Medicines</label>
                  <Button variant="ghost" size="sm" onClick={addManualMedicine}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                </div>
                <div className="space-y-3">
                  {manualForm.medicines.map((m, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Medicine {i + 1}</span>
                        {manualForm.medicines.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMedicine(i)}><Trash2 className="h-3 w-3" /></Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Medicine name" value={m.name} onChange={e => updateMedicine(i, 'name', e.target.value)} className="col-span-2" />
                        <Input placeholder="Dosage (e.g. 500mg)" value={m.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} />
                        <Input placeholder="Frequency (e.g. TDS)" value={m.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} />
                        <Input placeholder="Duration (e.g. 5 days)" value={m.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} />
                        <Input placeholder="Instructions" value={m.instructions} onChange={e => updateMedicine(i, 'instructions', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={saveManual} className="w-full">Save Prescription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="rounded-card shadow-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">No Prescriptions Yet</h3>
            <p className="text-sm text-muted-foreground">Add your first prescription manually or use AI to parse one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {prescriptions.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={`rounded-card shadow-sm ${p.status === 'completed' ? 'opacity-60' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold">{p.diagnosis || 'Prescription'}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            {p.prescribed_by && <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.prescribed_by}</span>}
                            {p.clinic_name && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.clinic_name}</span>}
                            {p.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.date).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleStatus(p.id, p.status)}>
                          {p.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deletePrescription(p.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    {getMedicines(p.medicines).length > 0 && (
                      <div className="space-y-2 mt-3">
                        {getMedicines(p.medicines).map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                            <Pill className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium">{m.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{m.dosage} • {m.frequency}{m.duration ? ` • ${m.duration}` : ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

export default Prescriptions;
