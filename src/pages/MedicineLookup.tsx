import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Search, X, Loader2, Sparkles, Heart, Pill, Package, Shield, Info, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import pillRoundWhite from '@/assets/pill-round-white.png';
import pillCapsuleBlue from '@/assets/pill-capsule-blue.png';
import pillCapsuleRed from '@/assets/pill-capsule-red.png';
import pillRoundYellow from '@/assets/pill-round-yellow.png';
import pillCapsuleGreen from '@/assets/pill-capsule-green.png';
import pillRoundOrange from '@/assets/pill-round-orange.png';
import pillCapsulePurple from '@/assets/pill-capsule-purple.png';
import pillCapsuleBrown from '@/assets/pill-capsule-brown.png';

const pillImages = [
  pillRoundWhite, pillCapsuleBlue, pillCapsuleRed, pillRoundYellow,
  pillCapsuleGreen, pillRoundOrange, pillCapsulePurple, pillCapsuleBrown,
];

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

const categoryColors: Record<string, string> = {
  'Pain Relief': 'bg-destructive/10 text-destructive border-destructive/20',
  'Antibiotic': 'bg-success/10 text-success border-success/20',
  'Cardiac': 'bg-info/10 text-info border-info/20',
  'Diabetes': 'bg-warning/10 text-warning border-warning/20',
  'Gastrointestinal': 'bg-accent/10 text-accent border-accent/20',
  'Allergy': 'bg-primary/10 text-primary border-primary/20',
  'Respiratory': 'bg-info/10 text-info border-info/20',
  'Neurological': 'bg-accent/10 text-accent border-accent/20',
  'Mental Health': 'bg-primary/10 text-primary border-primary/20',
  'Steroid': 'bg-warning/10 text-warning border-warning/20',
  'Thyroid': 'bg-success/10 text-success border-success/20',
};

const categoryGradients: Record<string, string> = {
  'Pain Relief': 'from-destructive/20 to-destructive/5',
  'Antibiotic': 'from-success/20 to-success/5',
  'Cardiac': 'from-info/20 to-info/5',
  'Diabetes': 'from-warning/20 to-warning/5',
  'Gastrointestinal': 'from-accent/20 to-accent/5',
  'Allergy': 'from-primary/20 to-primary/5',
  'Respiratory': 'from-info/20 to-info/5',
  'Neurological': 'from-accent/20 to-accent/5',
  'Mental Health': 'from-primary/20 to-primary/5',
  'Steroid': 'from-warning/20 to-warning/5',
  'Thyroid': 'from-success/20 to-success/5',
};

const pregnancyBadge = (safety: string | null) => {
  if (!safety) return { cls: 'bg-muted text-muted-foreground', label: 'Unknown', icon: '●' };
  const lower = safety.toLowerCase();
  if (lower.includes('contraindicated') || lower.includes('category x') || lower.includes('category d') || lower.includes('avoid'))
    return { cls: 'bg-destructive/10 text-destructive border border-destructive/20', label: 'Pregnancy Risk', icon: '⚠' };
  if (lower.includes('caution') || lower.includes('category c') || lower.includes('only if'))
    return { cls: 'bg-warning/10 text-warning border border-warning/20', label: 'Use with Caution', icon: '⚡' };
  return { cls: 'bg-success/10 text-success border border-success/20', label: 'Generally Safe', icon: '✓' };
};

const getMedicineImage = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pillImages[Math.abs(hash) % pillImages.length];
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

  const pBadge = selected ? pregnancyBadge(selected.pregnancy_safety) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header gradient-health">
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Pill className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">Medicine Lookup</h1>
            <p className="text-primary-foreground/80 text-sm">Search & explore medicines with AI-powered insights</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl bg-warning/8 border border-warning/20 px-4 py-3"
      >
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <p className="text-xs text-muted-foreground">
          Medicine information is for reference only. Always consult your pharmacist or doctor.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by medicine name or brand..."
            className="pl-12 h-12 text-base rounded-xl border-border/50 bg-card shadow-sm focus-visible:shadow-md transition-shadow"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                category === c
                  ? 'bg-primary text-primary-foreground shadow-colored'
                  : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} medicine{filtered.length !== 1 ? 's' : ''} found
        </p>
        {myMedicines.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Heart className="h-3 w-3 fill-current text-destructive" />
            {myMedicines.length} saved
          </Badge>
        )}
      </div>

      <div className="relative">
        {/* Medicine Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${selected ? 'lg:pr-[440px]' : ''}`}>
          <AnimatePresence mode="popLayout">
            {filtered.map((m, index) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
              >
                <Card
                  className={`group cursor-pointer overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    selected?.id === m.id
                      ? 'ring-2 ring-primary shadow-glow border-primary/30'
                      : 'border-border/40 hover:border-primary/20'
                  }`}
                  onClick={() => openDetail(m)}
                >
                  {/* Top gradient strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${categoryGradients[m.category || ''] || 'from-primary/20 to-primary/5'}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${categoryGradients[m.category || ''] || 'from-muted to-muted/50'} flex items-center justify-center overflow-hidden p-2 shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                        <img src={getMedicineImage(m.name)} alt={m.name} className="h-full w-full object-contain drop-shadow-md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-heading font-bold text-sm truncate">{m.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{m.brand}</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); toggleMyMedicine(m.id); }}
                            className="shrink-0 p-1.5 rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <Heart className={`h-4 w-4 transition-all ${myMedicines.includes(m.id) ? 'fill-destructive text-destructive scale-110' : 'text-muted-foreground'}`} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-[10px] px-2 py-0.5 rounded-md border ${categoryColors[m.category || ''] || 'bg-muted text-muted-foreground'}`}>
                            {m.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{m.strength}</span>
                        </div>
                        {m.price != null && (
                          <p className="text-sm font-bold mt-2 text-primary">₹{m.price}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center py-16 text-muted-foreground"
            >
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <p className="font-heading font-semibold text-lg">No medicines found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: 460, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 460, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed lg:absolute right-0 top-0 w-full sm:w-[430px] h-full lg:h-auto bg-card border-l lg:border lg:rounded-2xl shadow-2xl z-40 overflow-y-auto max-h-[calc(100vh-140px)]"
            >
              {/* Detail header with gradient */}
              <div className={`relative p-6 pb-4 bg-gradient-to-br ${categoryGradients[selected.category || ''] || 'from-primary/10 to-primary/5'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg flex items-center justify-center overflow-hidden p-2">
                      <img src={getMedicineImage(selected.name)} alt={selected.name} className="h-full w-full object-contain drop-shadow-lg" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl">{selected.name}</h2>
                      <p className="text-sm text-muted-foreground">{selected.brand}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.strength}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-card/60" onClick={() => setSelected(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className={`text-xs px-3 py-1 rounded-lg border ${categoryColors[selected.category || ''] || 'bg-muted text-muted-foreground'}`}>
                    {selected.category}
                  </Badge>
                  {pBadge && (
                    <Badge className={`text-xs px-3 py-1 rounded-lg ${pBadge.cls}`}>
                      {pBadge.icon} {pBadge.label}
                    </Badge>
                  )}
                  {selected.price != null && (
                    <Badge className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold">
                      ₹{selected.price}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <Tabs defaultValue="info">
                  <TabsList className="w-full bg-muted/50 rounded-xl p-1">
                    <TabsTrigger value="info" className="flex-1 text-xs rounded-lg gap-1.5 data-[state=active]:shadow-sm">
                      <Info className="h-3.5 w-3.5" /> Info
                    </TabsTrigger>
                    <TabsTrigger value="dosage" className="flex-1 text-xs rounded-lg gap-1.5 data-[state=active]:shadow-sm">
                      <Package className="h-3.5 w-3.5" /> Dosage
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="flex-1 text-xs rounded-lg gap-1.5 data-[state=active]:shadow-sm">
                      <Shield className="h-3.5 w-3.5" /> Safety
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
                    <p className="text-sm leading-relaxed">{selected.description}</p>
                    {selected.storage && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{selected.storage}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="dosage" className="space-y-4 mt-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">A</span>
                        </div>
                        <h4 className="text-sm font-semibold">Adult Dosage</h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">{selected.dosage_adult || 'Not specified'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-success/5 border border-success/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-md bg-success/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-success">C</span>
                        </div>
                        <h4 className="text-sm font-semibold">Child Dosage</h4>
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">{selected.dosage_child || 'Not specified'}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="safety" className="space-y-3 mt-4">
                    {selected.side_effects && (
                      <div className="p-3 rounded-xl bg-warning/5 border border-warning/10">
                        <h4 className="text-xs font-bold mb-1.5 text-warning flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5" /> Side Effects
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selected.side_effects}</p>
                      </div>
                    )}
                    {selected.contraindications && (
                      <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                        <h4 className="text-xs font-bold mb-1.5 text-destructive flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5" /> Contraindications
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selected.contraindications}</p>
                      </div>
                    )}
                    {selected.pregnancy_safety && (
                      <div className="p-3 rounded-xl bg-info/5 border border-info/10">
                        <h4 className="text-xs font-bold mb-1.5 text-info flex items-center gap-1.5">
                          <Heart className="h-3.5 w-3.5" /> Pregnancy Safety
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selected.pregnancy_safety}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* AI Summary */}
                <div className="border-t border-border/30 pt-4">
                  <Button
                    onClick={getAISummary}
                    disabled={aiLoading}
                    className="w-full rounded-xl h-11 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-colored"
                  >
                    {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Summary...</> : <><Sparkles className="h-4 w-4" /> AI Pharmacist Summary</>}
                  </Button>

                  <AnimatePresence>
                    {aiSummary && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-3 overflow-hidden">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                          <p className="text-sm leading-relaxed">{aiSummary.plain_language_summary}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-primary" /> Key Benefits
                          </h4>
                          {aiSummary.key_benefits.map((b, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="h-4 w-4 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] text-success">✓</span>
                              </div>
                              {b}
                            </div>
                          ))}
                        </div>
                        {aiSummary.common_questions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold">Common Questions</h4>
                            {aiSummary.common_questions.map((q, i) => (
                              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/20">
                                <p className="text-xs font-semibold mb-1">{q.question}</p>
                                <p className="text-xs text-muted-foreground">{q.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant={myMedicines.includes(selected.id) ? 'default' : 'outline'}
                  className="w-full rounded-xl h-11"
                  onClick={() => toggleMyMedicine(selected.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 transition-all ${myMedicines.includes(selected.id) ? 'fill-current scale-110' : ''}`} />
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
