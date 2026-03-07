import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Activity, Loader2, Phone, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const commonSymptoms = ['Fever', 'Headache', 'Cough', 'Chest Pain', 'Nausea', 'Dizziness', 'Shortness of Breath', 'Fatigue'];

interface AnalysisResult {
  risk_score: number;
  severity: string;
  detected_symptoms: { name: string; severity: string }[];
  possible_conditions: { name: string; probability: number; description: string }[];
  recommended_actions: string[];
  emergency_flag: boolean;
  follow_up_questions?: string[];
}

interface HistoryItem {
  id: string;
  symptoms: string;
  risk_score: number | null;
  severity: string | null;
  created_at: string;
}

const SymptomChecker = () => {
  const { user } = useAuth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const addSymptom = (s: string) => {
    setSymptoms(prev => prev ? `${prev}, ${s}` : s);
  };

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('symptom_logs')
      .select('id, symptoms, risk_score, severity, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setHistory(data);
    setShowHistory(true);
  };

  const deleteHistory = async (id: string) => {
    await supabase.from('symptom_logs').delete().eq('id', id);
    setHistory(prev => prev.filter(h => h.id !== id));
    toast.success('Entry deleted');
  };

  const analyze = async () => {
    if (!symptoms.trim() || !age || !gender || !duration) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('claude-symptom-analysis', {
        body: { symptoms, age: parseInt(age), gender, duration },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);

      // Save to DB
      if (user) {
        await supabase.from('symptom_logs').insert({
          user_id: user.id,
          symptoms,
          severity: data.severity,
          risk_score: data.risk_score,
          detected_symptoms: data.detected_symptoms,
          possible_conditions: data.possible_conditions,
          recommended_actions: data.recommended_actions,
        });
      }
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (score: number) => {
    if (score >= 80) return 'bg-destructive text-destructive-foreground';
    if (score >= 50) return 'bg-warning text-warning-foreground';
    if (score >= 20) return 'bg-yellow-400 text-black';
    return 'bg-success text-success-foreground';
  };

  const severityColor = (s: string) => {
    if (s === 'severe') return 'bg-destructive/10 text-destructive';
    if (s === 'moderate') return 'bg-warning/10 text-warning';
    return 'bg-success/10 text-success';
  };

  return (
    <div className="space-y-6">
      {/* UGC Banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-warning/10 border border-warning/30 p-4">
        <div className="stat-icon-orange h-9 w-9 shrink-0"><AlertTriangle className="h-4 w-4" /></div>
        <p className="text-sm text-warning pt-1.5">
          This tool provides general information only. Consult a healthcare professional for medical advice.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="stat-icon-blue h-8 w-8"><Activity className="h-4 w-4" /></div>
                <CardTitle className="text-lg">Describe Your Symptoms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Age</label>
                  <Input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less than 24 hours">Less than 24 hours</SelectItem>
                      <SelectItem value="1-3 days">1-3 days</SelectItem>
                      <SelectItem value="3-7 days">3-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="more than 2 weeks">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Symptoms</label>
                <Textarea placeholder="Describe your symptoms..." value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Common symptoms (click to add):</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map(s => (
                    <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all" onClick={() => addSymptom(s)}>{s}</Button>
                  ))}
                </div>
              </div>

              <Button onClick={analyze} disabled={loading} className="w-full gradient-health text-white border-0 shadow-glow hover:opacity-90 rounded-xl">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : <><Activity className="h-4 w-4 mr-2" /> Analyze with AI</>}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Emergency Alert */}
                {result.emergency_flag && (
                  <div className="mb-4 rounded-card bg-destructive/10 border-2 border-destructive p-4 animate-pulse-slow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                        <span className="font-heading font-bold text-destructive text-lg">Emergency Detected!</span>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => window.open('tel:112')}>
                        <Phone className="h-4 w-4 mr-1" /> Call 112
                      </Button>
                    </div>
                    <p className="text-sm text-destructive mt-2">Critical symptoms detected. Please seek immediate medical attention.</p>
                  </div>
                )}

                {/* Risk Score */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-lg">Risk Assessment</h3>
                      <Badge className={riskColor(result.risk_score)}>{result.severity.toUpperCase()}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score</span>
                        <span className="font-bold">{result.risk_score}/100</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${result.risk_score >= 80 ? 'bg-destructive' : result.risk_score >= 50 ? 'bg-warning' : result.risk_score >= 20 ? 'bg-yellow-400' : 'bg-success'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.risk_score}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detected Symptoms */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Detected Symptoms</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_symptoms.map((s, i) => (
                        <Badge key={i} variant="outline" className={severityColor(s.severity)}>
                          {s.name} <span className="ml-1 opacity-70">({s.severity})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Possible Conditions */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Possible Conditions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {result.possible_conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{c.name}</span>
                            <Badge variant="secondary" className="text-xs">{c.probability}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card className="rounded-card shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Recommended Actions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommended_actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                    {(result.severity === 'severe' || result.severity === 'critical') && (
                      <Button className="w-full mt-4" variant="destructive" onClick={() => window.open('tel:112')}>
                        <Phone className="h-4 w-4 mr-2" /> Consult a Doctor Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Sidebar */}
        <div>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Analysis History</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={fetchHistory}>
                  <Clock className="h-3.5 w-3.5 mr-1" /> Load
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {showHistory ? 'No previous analyses.' : 'Click Load to view history.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map(h => (
                    <div key={h.id} className="p-3 rounded-lg bg-muted/50 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</p>
                          <p className="text-sm truncate mt-0.5">{h.symptoms}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{h.severity || 'N/A'}</Badge>
                            <span className="text-xs text-muted-foreground">Score: {h.risk_score ?? 'N/A'}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => deleteHistory(h.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
