import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Search, Pill, X, Loader2, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Medicine {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  strength: string | null;
  description: string | null;
  dosage_adult: string | null;
  dosage_child: string | null;
  side_effects: string | null;
  contraindications: string | null;
  pregnancy_safety: string | null;
  storage: string | null;
  price: number | null;
}

interface AISummary {
  plain_language_summary: string;
  key_benefits: string[];
  common_questions: { question: string; answer: string }[];
}

const categories = ['All', 'Pain Relief', 'Antibiotic', 'Cardiac', 'Diabetes', 'Gastrointestinal', 'Allergy', 'Respiratory', 'Neurological', 'Mental Health', 'Steroid', 'Thyroid'];

const pregnancyColor = (safety: string | null) => {
  if (!safety) return 'bg-muted text-muted-foreground';
  const lower = safety.toLowerCase();
  if (lower.includes('contraindicated') || lower.includes('category x') || lower.includes('category d') || lower.includes('avoid')) return 'bg-destructive/10 text-destructive';
  if (lower.includes('caution') || lower.includes('category c') || lower.includes('only if')) return 'bg-warning/10 text-warning';
  return 'bg-success/10 text-success';
};

const MedicineLookup = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [myMedicines, setMyMedicines] = useState<string[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const { data } = await supabase.from('medicines').select('*').order('name');
      if (data) setMedicines(data as Medicine[]);
    };
    fetchMedicines();
  }, []);

  const filtered = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.brand?.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || m.category === category;
    return matchesSearch && matchesCategory;
  });

  const openDetail = (m: Medicine) => {
    setSelected(m);
    setAiSummary(null);
  };

  const getAISummary = async () => {
    if (!selected) return;
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('claude-medicine-summary', {
        body: { medicine_name: selected.name, medicine_data: selected },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAiSummary(data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to get AI summary');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleMyMedicine = (id: string) => {
    setMyMedicines(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    toast.success(myMedicines.includes(id) ? 'Removed from My Medicines' : 'Added to My Medicines');
  };

  return (
    <div className="space-y-6">
      {/* UGC Banner */}
      <div className="flex items-start gap-3 rounded-card bg-warning/10 border border-warning/30 p-4">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          Medicine information is for reference only. Always consult your pharmacist or doctor.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search medicines..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        {/* Medicine Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all ${selected ? 'lg:pr-[420px]' : ''}`}>
          {filtered.map(m => (
            <Card
              key={m.id}
              className={`rounded-card shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selected?.id === m.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => openDetail(m)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{m.category}</Badge>
                </div>
                <h3 className="font-heading font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.brand}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{m.strength}</span>
                  {m.price != null && <span className="text-sm font-semibold">₹{m.price}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No medicines found.</div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed lg:absolute right-0 top-0 w-full sm:w-[400px] h-full lg:h-auto bg-card border-l lg:border lg:rounded-card shadow-xl z-40 overflow-y-auto max-h-[calc(100vh-140px)]"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-xl">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">{selected.brand} • {selected.strength}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary">{selected.category}</Badge>
                  <Badge className={pregnancyColor(selected.pregnancy_safety)}>
                    {selected.pregnancy_safety?.includes('Contraindicated') || selected.pregnancy_safety?.includes('Category X') ? '⚠ Pregnancy Risk' : selected.pregnancy_safety?.includes('safe') || selected.pregnancy_safety?.includes('Category B') ? '✓ Pregnancy Safe' : '⚡ Pregnancy Caution'}
                  </Badge>
                </div>

                <Tabs defaultValue="info">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" className="flex-1 text-xs">Info</TabsTrigger>
                    <TabsTrigger value="dosage" className="flex-1 text-xs">Dosage</TabsTrigger>
                    <TabsTrigger value="safety" className="flex-1 text-xs">Safety</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-3 mt-3">
                    <p className="text-sm">{selected.description}</p>
                    {selected.storage && <p className="text-xs text-muted-foreground">📦 {selected.storage}</p>}
                    {selected.price != null && <p className="text-lg font-bold">₹{selected.price}</p>}
                  </TabsContent>
                  <TabsContent value="dosage" className="space-y-3 mt-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Adult Dosage</h4>
                      <p className="text-sm text-muted-foreground">{selected.dosage_adult || 'Not specified'}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Child Dosage</h4>
                      <p className="text-sm text-muted-foreground">{selected.dosage_child || 'Not specified'}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="safety" className="space-y-3 mt-3">
                    {selected.side_effects && (
                      <div><h4 className="text-sm font-semibold mb-1">Side Effects</h4><p className="text-sm text-muted-foreground">{selected.side_effects}</p></div>
                    )}
                    {selected.contraindications && (
                      <div><h4 className="text-sm font-semibold mb-1">Contraindications</h4><p className="text-sm text-muted-foreground">{selected.contraindications}</p></div>
                    )}
                    {selected.pregnancy_safety && (
                      <div><h4 className="text-sm font-semibold mb-1">Pregnancy Safety</h4><p className="text-sm text-muted-foreground">{selected.pregnancy_safety}</p></div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* AI Summary */}
                <div className="border-t pt-4">
                  <Button variant="outline" className="w-full" onClick={getAISummary} disabled={aiLoading}>
                    {aiLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> AI Pharmacist Summary</>}
                  </Button>
                  {aiSummary && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-3">
                      <p className="text-sm bg-primary/5 p-3 rounded-lg">{aiSummary.plain_language_summary}</p>
                      <div>
                        <h4 className="text-xs font-semibold mb-1">Key Benefits</h4>
                        <ul className="space-y-1">
                          {aiSummary.key_benefits.map((b, i) => <li key={i} className="text-xs text-muted-foreground">✓ {b}</li>)}
                        </ul>
                      </div>
                      {aiSummary.common_questions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1">Common Questions</h4>
                          {aiSummary.common_questions.map((q, i) => (
                            <div key={i} className="mb-2">
                              <p className="text-xs font-medium">{q.question}</p>
                              <p className="text-xs text-muted-foreground">{q.answer}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <Button
                  variant={myMedicines.includes(selected.id) ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => toggleMyMedicine(selected.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${myMedicines.includes(selected.id) ? 'fill-current' : ''}`} />
                  {myMedicines.includes(selected.id) ? 'In My Medicines' : 'Add to My Medicines'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicineLookup;
