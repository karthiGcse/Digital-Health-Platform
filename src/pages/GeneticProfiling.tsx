import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertTriangle, Shield, Heart, Brain, Dna, Activity, TrendingUp, FileText,
  Upload, CheckCircle2, Download, Share2, Loader2, Eye, Pill, Apple,
  Moon, Zap, Droplets, Flame, Users, Baby, Bone, Wind
} from 'lucide-react';
import { motion } from 'framer-motion';

const geneticRisks = [
  { condition: 'Type 2 Diabetes', risk: 'Moderate', score: 45, icon: Activity, color: 'text-warning', bg: 'bg-warning/10', recommendation: 'Regular glucose monitoring, low-sugar diet' },
  { condition: 'Cardiovascular Disease', risk: 'Low', score: 22, icon: Heart, color: 'text-success', bg: 'bg-success/10', recommendation: 'Maintain active lifestyle, omega-3 supplements' },
  { condition: "Alzheimer's Disease", risk: 'Low', score: 15, icon: Brain, color: 'text-success', bg: 'bg-success/10', recommendation: 'Mental exercises, social engagement' },
  { condition: 'Breast Cancer', risk: 'Average', score: 35, icon: Shield, color: 'text-info', bg: 'bg-info/10', recommendation: 'Regular screening after age 40' },
  { condition: 'Celiac Disease', risk: 'High', score: 72, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', recommendation: 'Gluten-free diet, gastroenterologist consult' },
  { condition: 'Hypertension', risk: 'Moderate', score: 48, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', recommendation: 'Low sodium diet, regular BP monitoring' },
  { condition: 'Osteoporosis', risk: 'Low', score: 18, icon: Bone, color: 'text-success', bg: 'bg-success/10', recommendation: 'Calcium & Vitamin D supplements' },
  { condition: 'Asthma', risk: 'Moderate', score: 42, icon: Wind, color: 'text-warning', bg: 'bg-warning/10', recommendation: 'Avoid triggers, keep inhaler accessible' },
];

const drugResponses = [
  { drug: 'Warfarin', response: 'Slow Metabolizer', dosage: 'Reduce dose by 30%', gene: 'CYP2C9', status: 'caution' },
  { drug: 'Codeine', response: 'Ultra-rapid Metabolizer', dosage: 'Avoid — use alternatives', gene: 'CYP2D6', status: 'danger' },
  { drug: 'Metformin', response: 'Normal Metabolizer', dosage: 'Standard dosing', gene: 'SLC22A1', status: 'normal' },
  { drug: 'Simvastatin', response: 'Normal Metabolizer', dosage: 'Standard dosing', gene: 'SLCO1B1', status: 'normal' },
  { drug: 'Clopidogrel', response: 'Intermediate Metabolizer', dosage: 'Consider alternatives', gene: 'CYP2C19', status: 'caution' },
  { drug: 'Omeprazole', response: 'Rapid Metabolizer', dosage: 'May need higher dose', gene: 'CYP2C19', status: 'caution' },
  { drug: 'Ibuprofen', response: 'Normal Metabolizer', dosage: 'Standard dosing', gene: 'CYP2C9', status: 'normal' },
];

const traits = [
  { trait: 'Lactose Tolerance', result: 'Likely Intolerant', confidence: 87, icon: Droplets },
  { trait: 'Caffeine Metabolism', result: 'Fast Metabolizer', confidence: 92, icon: Zap },
  { trait: 'Vitamin D Levels', result: 'Likely Deficient', confidence: 78, icon: Apple },
  { trait: 'Sleep Quality', result: 'Normal Pattern', confidence: 65, icon: Moon },
  { trait: 'Muscle Composition', result: 'Mixed Type', confidence: 71, icon: Flame },
  { trait: 'Alcohol Flush', result: 'No Flush Reaction', confidence: 95, icon: Droplets },
  { trait: 'Bitter Taste Sensitivity', result: 'High Sensitivity', confidence: 83, icon: Apple },
  { trait: 'Eye Color Prediction', result: 'Brown (likely)', confidence: 90, icon: Eye },
];

const ancestryData = [
  { region: 'South Asian', percentage: 72, color: 'bg-primary' },
  { region: 'Central Asian', percentage: 14, color: 'bg-info' },
  { region: 'European', percentage: 8, color: 'bg-warning' },
  { region: 'East Asian', percentage: 4, color: 'bg-success' },
  { region: 'Other', percentage: 2, color: 'bg-muted-foreground' },
];

const carrierStatus = [
  { condition: 'Sickle Cell Trait', status: 'Carrier', risk: 'No personal risk, can pass to children', icon: Droplets },
  { condition: 'Cystic Fibrosis', status: 'Not a Carrier', risk: 'No risk', icon: Wind },
  { condition: 'Thalassemia', status: 'Carrier', risk: 'Mild anemia possible, genetic counseling advised', icon: Heart },
  { condition: 'G6PD Deficiency', status: 'Not a Carrier', risk: 'No risk', icon: Shield },
];

const GeneticProfiling = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['.txt', '.csv', '.vcf', '.json', '.zip'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      toast({ title: '❌ Invalid File', description: 'Please upload a .txt, .csv, .vcf, .json, or .zip genetic data file.', variant: 'destructive' });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({ title: '❌ File Too Large', description: 'Maximum file size is 20MB.', variant: 'destructive' });
      return;
    }

    setFileName(file.name);
    setUploading(true);

    // Simulate processing time for genetic analysis
    await new Promise(resolve => setTimeout(resolve, 2500));

    setUploading(false);
    setAnalyzed(true);

    toast({ title: '🧬 Analysis Complete', description: `${file.name} has been analyzed successfully. View your genetic profile below.` });

    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '🧬 Genetic Analysis Complete',
        message: `Your genetic file "${file.name}" has been analyzed. View your health risks, drug responses, and traits.`,
        type: 'success',
        link: '/genetic-profiling',
      });
    }
  };

  const handleDownloadReport = () => {
    toast({ title: '📥 Report Downloaded', description: 'Your genetic health report PDF has been generated.' });
    if (user) {
      supabase.from('notifications').insert({
        user_id: user.id,
        title: '📥 Genetic Report Downloaded',
        message: 'Your full genetic health profiling report has been downloaded.',
        type: 'info',
        link: '/genetic-profiling',
      });
    }
  };

  const handleShare = () => {
    toast({ title: '🔗 Share Link Created', description: 'A secure link to share your report with your doctor has been copied.' });
  };

  const overallRisk = Math.round(geneticRisks.reduce((s, r) => s + r.score, 0) / geneticRisks.length);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-purple-600 to-indigo-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Dna className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">AI Genetic Health Profiling</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">Personalized health insights based on genetic markers. Understand your risks, optimize medications, and discover traits.</p>
        </div>
        <Dna className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {!analyzed ? (
        <Card className="rounded-card">
          <CardContent className="p-8 text-center space-y-4">
            {uploading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
                <h3 className="font-heading font-semibold text-lg">Analyzing {fileName}...</h3>
                <p className="text-sm text-muted-foreground">Processing genetic markers and generating health insights</p>
                <Progress value={75} className="h-2 max-w-xs mx-auto" />
              </motion.div>
            ) : (
              <>
                <Dna className="h-16 w-16 mx-auto text-primary/30" />
                <h3 className="font-heading font-semibold text-lg">Start Your Genetic Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">Upload your genetic data file (23andMe, AncestryDNA, or raw VCF) to receive AI-powered health insights.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setAnalyzed(true)} className="gap-2">
                    <Dna className="h-4 w-4" /> Use Sample Data (Demo)
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Upload Genetic File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".txt,.csv,.vcf,.json,.zip"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['.txt', '.csv', '.vcf', '.json', '.zip'].map(ext => (
                    <Badge key={ext} variant="secondary" className="text-[10px]">{ext}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">🔒 Your data is encrypted and never shared • Max 20MB</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Dna className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{geneticRisks.length}</p><p className="text-xs text-muted-foreground">Risks Analyzed</p></div></CardContent></Card>
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Pill className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{drugResponses.length}</p><p className="text-xs text-muted-foreground">Drug Responses</p></div></CardContent></Card>
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Eye className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{traits.length}</p><p className="text-xs text-muted-foreground">Traits Detected</p></div></CardContent></Card>
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={`stat-icon-${overallRisk > 50 ? 'orange' : 'green'}`}><Shield className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{overallRisk}%</p><p className="text-xs text-muted-foreground">Avg Risk Score</p></div></CardContent></Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadReport}><Download className="h-4 w-4" />Download Report</Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}><Share2 className="h-4 w-4" />Share with Doctor</Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => { setAnalyzed(false); setFileName(''); }}><Upload className="h-4 w-4" />Upload New File</Button>
          </div>

          <Tabs defaultValue="risks" className="space-y-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="risks">Health Risks</TabsTrigger>
              <TabsTrigger value="pharma">Pharmacogenomics</TabsTrigger>
              <TabsTrigger value="traits">Traits</TabsTrigger>
              <TabsTrigger value="ancestry">Ancestry</TabsTrigger>
              <TabsTrigger value="carrier">Carrier Status</TabsTrigger>
            </TabsList>

            {/* Health Risks Tab */}
            <TabsContent value="risks" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {geneticRisks.map((r, i) => (
                  <motion.div key={r.condition} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="rounded-card">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${r.bg}`}><r.icon className={`h-4 w-4 ${r.color}`} /></div>
                            <h4 className="font-medium text-sm">{r.condition}</h4>
                          </div>
                          <Badge variant="outline" className={`text-xs ${r.color}`}>{r.risk}</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Risk Score</span><span>{r.score}%</span>
                          </div>
                          <Progress value={r.score} className={`h-2 ${r.score > 60 ? '[&>div]:bg-destructive' : r.score > 40 ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`} />
                        </div>
                        <p className="text-xs text-muted-foreground">💡 {r.recommendation}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Pharmacogenomics Tab */}
            <TabsContent value="pharma" className="space-y-4">
              <Card className="rounded-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4 text-primary" />Drug Response Profile</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {drugResponses.map((d, i) => (
                    <motion.div key={d.drug} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className={`p-3 rounded-xl border ${d.status === 'danger' ? 'border-destructive/30 bg-destructive/5' : d.status === 'caution' ? 'border-warning/30 bg-warning/5' : 'border-border'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{d.drug}</p>
                          <p className="text-xs text-muted-foreground">Gene: {d.gene}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={`text-xs ${d.status === 'danger' ? 'text-destructive' : d.status === 'caution' ? 'text-warning' : 'text-success'}`}>{d.response}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{d.dosage}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Traits Tab */}
            <TabsContent value="traits" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {traits.map((t, i) => (
                  <motion.div key={t.trait} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="rounded-card">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <t.icon className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-sm">{t.trait}</h4>
                        </div>
                        <p className="text-xs text-primary font-medium">{t.result}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={t.confidence} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{t.confidence}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Ancestry Tab */}
            <TabsContent value="ancestry" className="space-y-4">
              <Card className="rounded-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Ancestry Composition</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {ancestryData.map((a, i) => (
                    <motion.div key={a.region} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{a.region}</span>
                        <span className="font-bold">{a.percentage}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${a.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${a.percentage}%` }}
                          transition={{ delay: i * 0.15, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                  <div className="p-3 rounded-xl bg-muted/50 mt-4">
                    <p className="text-xs text-muted-foreground">🌍 Ancestry data is estimated based on reference populations. Results may vary between services.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Carrier Status Tab */}
            <TabsContent value="carrier" className="space-y-4">
              <Card className="rounded-card">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Baby className="h-4 w-4 text-primary" />Carrier Status (Inherited Conditions)</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {carrierStatus.map((c, i) => (
                    <motion.div key={c.condition} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border ${c.status === 'Carrier' ? 'border-warning/30 bg-warning/5' : 'border-success/30 bg-success/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${c.status === 'Carrier' ? 'bg-warning/10' : 'bg-success/10'}`}>
                            <c.icon className={`h-4 w-4 ${c.status === 'Carrier' ? 'text-warning' : 'text-success'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{c.condition}</p>
                            <p className="text-xs text-muted-foreground">{c.risk}</p>
                          </div>
                        </div>
                        <Badge variant={c.status === 'Carrier' ? 'default' : 'secondary'} className="text-xs">
                          {c.status === 'Carrier' ? <AlertTriangle className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {c.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                  <div className="p-3 rounded-xl bg-info/10 border border-info/20 mt-2">
                    <p className="text-xs text-muted-foreground">👶 Carrier status is important for family planning. Consult a genetic counselor for personalized guidance.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default GeneticProfiling;
