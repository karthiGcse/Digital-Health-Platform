import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Loader2, X, Plus, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  effect: string;
  management: string;
}

interface InteractionResult {
  interactions: Interaction[];
  summary: string;
}

const severityConfig = {
  mild: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  moderate: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  severe: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
};

const DrugInteractions = () => {
  const [medicineNames, setMedicineNames] = useState<string[]>([]);
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [regimenDrugs, setRegimenDrugs] = useState<string[]>([]);
  const [addDrug, setAddDrug] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [mode, setMode] = useState<'pair' | 'regimen'>('pair');

  useEffect(() => {
    const fetchNames = async () => {
      const { data } = await supabase.from('medicines').select('name').order('name');
      if (data) setMedicineNames(data.map(d => d.name));
    };
    fetchNames();
  }, []);

  const checkPair = async () => {
    if (!drug1 || !drug2) { toast.error('Select both drugs'); return; }
    if (drug1 === drug2) { toast.error('Select different drugs'); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('claude-drug-interactions', {
        body: { drugs: [drug1, drug2] },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      toast.error(e.message || 'Check failed');
    } finally {
      setLoading(false);
    }
  };

  const checkRegimen = async () => {
    if (regimenDrugs.length < 2) { toast.error('Add at least 2 drugs'); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('claude-drug-interactions', {
        body: { drugs: regimenDrugs },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      toast.error(e.message || 'Check failed');
    } finally {
      setLoading(false);
    }
  };

  const addToRegimen = () => {
    if (!addDrug || regimenDrugs.includes(addDrug)) return;
    setRegimenDrugs(prev => [...prev, addDrug]);
    setAddDrug('');
  };

  const exportReport = () => {
    if (!result) return;
    const text = `Drug Interaction Report\n${'='.repeat(40)}\n\nSummary: ${result.summary}\n\n${result.interactions.map(i => `${i.drug1} + ${i.drug2}\nSeverity: ${i.severity}\nEffect: ${i.effect}\nManagement: ${i.management}\n`).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug-interaction-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button variant={mode === 'pair' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('pair'); setResult(null); }} className={mode === 'pair' ? 'gradient-health text-white border-0 rounded-full shadow-glow' : 'rounded-full'}>Pairwise Check</Button>
        <Button variant={mode === 'regimen' ? 'default' : 'outline'} size="sm" onClick={() => { setMode('regimen'); setResult(null); }} className={mode === 'regimen' ? 'gradient-health text-white border-0 rounded-full shadow-glow' : 'rounded-full'}>Multi-Drug Regimen</Button>
      </div>

      {mode === 'pair' ? (
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="stat-icon-orange h-8 w-8"><AlertTriangle className="h-4 w-4" /></div>
              <CardTitle className="text-lg">Check Drug Interaction</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Drug 1</label>
                <Select value={drug1} onValueChange={setDrug1}>
                  <SelectTrigger><SelectValue placeholder="Select drug" /></SelectTrigger>
                  <SelectContent>{medicineNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Drug 2</label>
                <Select value={drug2} onValueChange={setDrug2}>
                  <SelectTrigger><SelectValue placeholder="Select drug" /></SelectTrigger>
                  <SelectContent>{medicineNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={checkPair} disabled={loading} className="w-full gradient-health text-white border-0 shadow-glow hover:opacity-90 rounded-xl">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking...</> : 'Check Interaction'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-card shadow-sm">
          <CardHeader><CardTitle className="text-lg">Multi-Drug Regimen Builder</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={addDrug} onValueChange={setAddDrug}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Add medicine" /></SelectTrigger>
                <SelectContent>{medicineNames.filter(n => !regimenDrugs.includes(n)).map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={addToRegimen} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            {regimenDrugs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {regimenDrugs.map(d => (
                  <Badge key={d} variant="secondary" className="gap-1 pr-1">
                    {d}
                    <button onClick={() => setRegimenDrugs(prev => prev.filter(x => x !== d))} className="h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <Button onClick={checkRegimen} disabled={loading || regimenDrugs.length < 2} className="w-full">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking All...</> : `Check All Interactions (${regimenDrugs.length} drugs)`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="rounded-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Summary</CardTitle>
                  <Button variant="outline" size="sm" onClick={exportReport}><FileDown className="h-4 w-4 mr-1" /> Save Report</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.summary}</p>
              </CardContent>
            </Card>

            {result.interactions.length === 0 ? (
              <Card className="rounded-card shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-success font-medium">✓ No significant interactions found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {result.interactions.map((inter, i) => {
                  const config = severityConfig[inter.severity];
                  return (
                    <Card key={i} className={`rounded-card shadow-sm border ${config.border}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{inter.drug1}</span>
                            <span className="text-muted-foreground">+</span>
                            <span className="font-medium text-sm">{inter.drug2}</span>
                          </div>
                          <Badge className={`${config.bg} ${config.text}`}>{inter.severity}</Badge>
                        </div>
                        <p className="text-sm mb-2">{inter.effect}</p>
                        <div className="bg-muted/50 p-2 rounded-lg">
                          <p className="text-xs"><span className="font-semibold">Management:</span> {inter.management}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrugInteractions;
