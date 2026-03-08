import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Heart, Brain, Dna, Activity, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const geneticRisks = [
  { condition: 'Type 2 Diabetes', risk: 'Moderate', score: 45, icon: Activity, color: 'text-warning', bg: 'bg-warning/10', recommendation: 'Regular glucose monitoring, low-sugar diet' },
  { condition: 'Cardiovascular Disease', risk: 'Low', score: 22, icon: Heart, color: 'text-success', bg: 'bg-success/10', recommendation: 'Maintain active lifestyle, omega-3 supplements' },
  { condition: 'Alzheimer\'s Disease', risk: 'Low', score: 15, icon: Brain, color: 'text-success', bg: 'bg-success/10', recommendation: 'Mental exercises, social engagement' },
  { condition: 'Breast Cancer', risk: 'Average', score: 35, icon: Shield, color: 'text-info', bg: 'bg-info/10', recommendation: 'Regular screening after age 40' },
  { condition: 'Celiac Disease', risk: 'High', score: 72, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', recommendation: 'Gluten-free diet, gastroenterologist consult' },
  { condition: 'Hypertension', risk: 'Moderate', score: 48, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', recommendation: 'Low sodium diet, regular BP monitoring' },
];

const drugResponses = [
  { drug: 'Warfarin', response: 'Slow Metabolizer', dosage: 'Reduce dose by 30%', gene: 'CYP2C9', status: 'caution' },
  { drug: 'Codeine', response: 'Ultra-rapid Metabolizer', dosage: 'Avoid — use alternatives', gene: 'CYP2D6', status: 'danger' },
  { drug: 'Metformin', response: 'Normal Metabolizer', dosage: 'Standard dosing', gene: 'SLC22A1', status: 'normal' },
  { drug: 'Simvastatin', response: 'Normal Metabolizer', dosage: 'Standard dosing', gene: 'SLCO1B1', status: 'normal' },
  { drug: 'Clopidogrel', response: 'Intermediate Metabolizer', dosage: 'Consider alternatives', gene: 'CYP2C19', status: 'caution' },
];

const traits = [
  { trait: 'Lactose Tolerance', result: 'Likely Intolerant', confidence: 87 },
  { trait: 'Caffeine Metabolism', result: 'Fast Metabolizer', confidence: 92 },
  { trait: 'Vitamin D Levels', result: 'Likely Deficient', confidence: 78 },
  { trait: 'Sleep Quality', result: 'Normal Pattern', confidence: 65 },
  { trait: 'Muscle Composition', result: 'Mixed Type', confidence: 71 },
  { trait: 'Alcohol Flush', result: 'No Flush Reaction', confidence: 95 },
];

const GeneticProfiling = () => {
  const [analyzed, setAnalyzed] = useState(false);

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
            <Dna className="h-16 w-16 mx-auto text-primary/30" />
            <h3 className="font-heading font-semibold text-lg">Start Your Genetic Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Upload your genetic data file (23andMe, AncestryDNA, or raw VCF) to receive AI-powered health insights.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setAnalyzed(true)} className="gap-2">
                <Dna className="h-4 w-4" /> Use Sample Data (Demo)
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> Upload Genetic File
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">🔒 Your data is encrypted and never shared</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="risks" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="risks">Health Risks</TabsTrigger>
            <TabsTrigger value="pharma">Pharmacogenomics</TabsTrigger>
            <TabsTrigger value="traits">Traits</TabsTrigger>
          </TabsList>

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

          <TabsContent value="pharma" className="space-y-4">
            <Card className="rounded-card">
              <CardHeader><CardTitle className="text-base">Drug Response Profile</CardTitle></CardHeader>
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

          <TabsContent value="traits" className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {traits.map((t, i) => (
                <motion.div key={t.trait} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="rounded-card">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-sm">{t.trait}</h4>
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
        </Tabs>
      )}
    </div>
  );
};

export default GeneticProfiling;
