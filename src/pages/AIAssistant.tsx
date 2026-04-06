import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Brain, Mic, MicOff, AlertTriangle, Sparkles, FileText,
  Pill, Loader2, CheckCircle2, Activity, Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';

const mockDiagnoses = [
  { condition: 'Upper Respiratory Tract Infection', confidence: 82, description: 'Viral infection affecting nose and throat', tests: ['Complete Blood Count', 'Throat Swab'] },
  { condition: 'Allergic Rhinitis', confidence: 65, description: 'Allergic reaction causing nasal congestion', tests: ['IgE Levels', 'Allergy Panel'] },
  { condition: 'Bronchitis', confidence: 45, description: 'Inflammation of bronchial tubes', tests: ['Chest X-Ray', 'Sputum Culture'] },
];

const mockConflicts = [
  { medA: 'Metformin', medB: 'Ibuprofen', effect: 'May increase risk of lactic acidosis', severity: 'moderate', alternative: 'Paracetamol 500mg' },
  { medA: 'Amlodipine', medB: 'Atorvastatin', effect: 'May increase statin side effects', severity: 'mild', alternative: 'Rosuvastatin 10mg' },
];

const AIAssistant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<typeof mockDiagnoses | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');

  const handleAnalyze = () => {
    if (!symptoms.trim()) {
      toast({ title: 'Enter symptoms', variant: 'destructive' });
      return;
    }
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setResults(mockDiagnoses);
      setAnalyzing(false);
    }, 2000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceText('Patient complains of persistent cough for 3 days, mild fever, body aches. Prescribed: Azithromycin 500mg once daily for 3 days, Paracetamol 650mg thrice daily, Cetirizine 10mg at night.');
      toast({ title: 'Voice captured ✓' });
    } else {
      setIsRecording(true);
      setVoiceText('');
    }
  };

  const generateSummary = () => {
    setGeneratingSummary(true);
    setSummary('');
    setTimeout(() => {
      setSummary('Patient presented with acute upper respiratory symptoms including cough, low-grade fever, and body aches for 3 days. Clinical examination suggests viral URTI. Prescribed short-course antibiotics (Azithromycin) with symptomatic relief (Paracetamol, Cetirizine). Follow-up in 5 days if symptoms persist.');
      setGeneratingSummary(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Doctor Assistant</h1>
          <p className="text-sm text-muted-foreground">Diagnosis, voice prescriptions & drug checks</p>
        </div>
      </div>

      <Tabs defaultValue="diagnosis">
        <TabsList>
          <TabsTrigger value="diagnosis">🧠 AI Diagnosis</TabsTrigger>
          <TabsTrigger value="voice">🎤 Voice Rx</TabsTrigger>
          <TabsTrigger value="conflicts">⚠️ Drug Conflicts</TabsTrigger>
          <TabsTrigger value="summary">📝 Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosis">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Textarea
                placeholder="Enter patient symptoms (e.g., persistent cough, fever 100°F, runny nose, body aches)..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAnalyze} disabled={analyzing} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {analyzing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing...</> : <><Sparkles className="h-4 w-4 mr-2" /> Analyze with AI</>}
              </Button>

              {results && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Top Diagnoses</h3>
                  {results.map((r, i) => (
                    <Card key={i} className={i === 0 ? 'border-amber-500/30' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold">{r.condition}</h4>
                          <Badge className={r.confidence > 70 ? 'bg-emerald-500/15 text-emerald-600' : r.confidence > 50 ? 'bg-amber-500/15 text-amber-600' : 'bg-muted text-muted-foreground'}>
                            {r.confidence}% confidence
                          </Badge>
                        </div>
                        <Progress value={r.confidence} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">{r.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs font-medium">Suggested tests:</span>
                          {r.tests.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Button
                  size="lg"
                  className={`h-20 w-20 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'} text-white`}
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {isRecording ? '🔴 Recording... Click to stop' : 'Click to start voice-to-prescription'}
              </p>

              {voiceText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="text-left">
                    <CardContent className="p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Captured Text:</p>
                      <p className="text-sm">{voiceText}</p>
                      <Button size="sm" variant="outline" className="mt-3">
                        <FileText className="h-4 w-4 mr-1" /> Convert to Prescription
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts">
          <div className="space-y-3">
            {mockConflicts.map((c, i) => (
              <Card key={i} className="border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold">
                        ⚠️ {c.medA} + {c.medB}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.effect}</p>
                      <Badge className={c.severity === 'moderate' ? 'bg-amber-500/15 text-amber-600 mt-2' : 'bg-blue-500/15 text-blue-600 mt-2'}>
                        {c.severity} risk
                      </Badge>
                      <div className="mt-2 p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
                        <p className="text-xs"><span className="font-medium">Alternative:</span> {c.alternative}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Button onClick={generateSummary} disabled={generatingSummary} className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                {generatingSummary ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Visit Summary</>}
              </Button>
              {summary && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-xs font-bold text-muted-foreground mb-2">AI Medical Summary</p>
                      <p className="text-sm leading-relaxed">{summary}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;
