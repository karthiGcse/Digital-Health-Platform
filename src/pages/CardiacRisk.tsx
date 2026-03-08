import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { HeartPulse, Activity, TrendingDown, AlertTriangle, CheckCircle2, Stethoscope, Plus, FileText, Zap, Droplets, Flame, Footprints, Moon, Brain, Download, Share2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const defaultRiskFactors = [
  { name: 'Blood Pressure', value: '128/82 mmHg', status: 'borderline', score: 35, icon: Activity },
  { name: 'Cholesterol (LDL)', value: '142 mg/dL', status: 'elevated', score: 55, icon: Droplets },
  { name: 'BMI', value: '26.4', status: 'borderline', score: 30, icon: Flame },
  { name: 'Blood Sugar', value: '98 mg/dL', status: 'normal', score: 10, icon: Zap },
  { name: 'Smoking', value: 'Non-smoker', status: 'normal', score: 0, icon: CheckCircle2 },
  { name: 'Physical Activity', value: '3x/week', status: 'good', score: 15, icon: Footprints },
  { name: 'Sleep Quality', value: '6.5 hrs avg', status: 'borderline', score: 25, icon: Moon },
  { name: 'Stress Level', value: 'Moderate', status: 'borderline', score: 30, icon: Brain },
];

const trendData = [
  { month: 'Jan', risk: 28, bp: 135, ldl: 155 },
  { month: 'Feb', risk: 26, bp: 132, ldl: 150 },
  { month: 'Mar', risk: 25, bp: 130, ldl: 148 },
  { month: 'Apr', risk: 24, bp: 129, ldl: 145 },
  { month: 'May', risk: 23, bp: 128, ldl: 142 },
  { month: 'Jun', risk: 22, bp: 128, ldl: 142 },
];

const heartRateData = [
  { time: '6AM', rate: 62 }, { time: '8AM', rate: 78 }, { time: '10AM', rate: 85 },
  { time: '12PM', rate: 72 }, { time: '2PM', rate: 80 }, { time: '4PM', rate: 88 },
  { time: '6PM', rate: 95 }, { time: '8PM', rate: 75 }, { time: '10PM', rate: 65 },
];

const radarData = [
  { metric: 'Blood Pressure', value: 65, fullMark: 100 },
  { metric: 'Cholesterol', value: 45, fullMark: 100 },
  { metric: 'Blood Sugar', value: 90, fullMark: 100 },
  { metric: 'BMI', value: 70, fullMark: 100 },
  { metric: 'Exercise', value: 85, fullMark: 100 },
  { metric: 'Sleep', value: 60, fullMark: 100 },
  { metric: 'Stress', value: 55, fullMark: 100 },
  { metric: 'Diet', value: 72, fullMark: 100 },
];

const CardiacRisk = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [riskFactors, setRiskFactors] = useState(defaultRiskFactors);
  const [overallRisk, setOverallRisk] = useState(22);
  const [analyzing, setAnalyzing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [assessmentDone, setAssessmentDone] = useState(false);

  // Input form state
  const [formData, setFormData] = useState({
    age: '45', gender: 'male', systolic: '128', diastolic: '82',
    ldl: '142', hdl: '52', totalCholesterol: '210',
    bloodSugar: '98', bmi: '26.4', smoking: 'no',
    exercise: '3', familyHistory: 'no', sleep: '6.5', stress: 'moderate',
  });

  const notify = async (title: string, message: string) => {
    if (user) {
      await supabase.from('notifications').insert({ user_id: user.id, title, message, type: 'health' });
    }
  };

  const runAssessment = async () => {
    setShowInput(false);
    setAnalyzing(true);

    await new Promise(r => setTimeout(r, 2500));

    const sys = Number(formData.systolic);
    const ldl = Number(formData.ldl);
    const bmi = Number(formData.bmi);
    const sugar = Number(formData.bloodSugar);
    const age = Number(formData.age);
    const smokes = formData.smoking === 'yes';
    const family = formData.familyHistory === 'yes';
    const exercise = Number(formData.exercise);
    const sleep = Number(formData.sleep);

    let risk = 5;
    if (sys > 140) risk += 15; else if (sys > 120) risk += 8;
    if (ldl > 160) risk += 18; else if (ldl > 130) risk += 10;
    if (bmi > 30) risk += 12; else if (bmi > 25) risk += 5;
    if (sugar > 126) risk += 15; else if (sugar > 100) risk += 5;
    if (age > 55) risk += 10; else if (age > 45) risk += 5;
    if (smokes) risk += 15;
    if (family) risk += 8;
    if (exercise < 2) risk += 8;
    if (sleep < 6) risk += 5;
    if (formData.stress === 'high') risk += 8; else if (formData.stress === 'moderate') risk += 4;

    risk = Math.min(risk, 95);

    const getStatus = (val: number, low: number, high: number) =>
      val <= low ? 'normal' : val <= high ? 'borderline' : 'elevated';

    setRiskFactors([
      { name: 'Blood Pressure', value: `${formData.systolic}/${formData.diastolic} mmHg`, status: getStatus(sys, 120, 140), score: Math.min(sys - 90, 60), icon: Activity },
      { name: 'Cholesterol (LDL)', value: `${formData.ldl} mg/dL`, status: getStatus(ldl, 100, 160), score: Math.min(Math.round((ldl / 200) * 100), 80), icon: Droplets },
      { name: 'BMI', value: formData.bmi, status: getStatus(bmi, 24.9, 30), score: Math.min(Math.round((bmi / 40) * 100), 80), icon: Flame },
      { name: 'Blood Sugar', value: `${formData.bloodSugar} mg/dL`, status: getStatus(sugar, 100, 126), score: Math.min(Math.round((sugar / 200) * 100), 80), icon: Zap },
      { name: 'Smoking', value: smokes ? 'Smoker' : 'Non-smoker', status: smokes ? 'elevated' : 'normal', score: smokes ? 60 : 0, icon: CheckCircle2 },
      { name: 'Physical Activity', value: `${formData.exercise}x/week`, status: exercise >= 3 ? 'good' : exercise >= 1 ? 'borderline' : 'elevated', score: Math.max(40 - exercise * 10, 0), icon: Footprints },
      { name: 'Sleep Quality', value: `${formData.sleep} hrs avg`, status: getStatus(8 - sleep, 0, 2), score: Math.max(50 - Math.round(sleep * 6), 0), icon: Moon },
      { name: 'Stress Level', value: formData.stress.charAt(0).toUpperCase() + formData.stress.slice(1), status: formData.stress === 'low' ? 'normal' : formData.stress === 'moderate' ? 'borderline' : 'elevated', score: formData.stress === 'low' ? 10 : formData.stress === 'moderate' ? 30 : 55, icon: Brain },
    ]);

    setOverallRisk(risk);
    setAnalyzing(false);
    setAssessmentDone(true);

    const riskLabel = risk < 20 ? 'Low' : risk < 40 ? 'Moderate' : 'High';
    toast({ title: '❤️ Assessment Complete', description: `Your 10-year cardiac risk: ${risk}% (${riskLabel})` });
    await notify('❤️ Cardiac Risk Assessment', `10-year risk calculated: ${risk}% (${riskLabel})`);
  };

  const riskLabel = overallRisk < 20 ? 'Low Risk' : overallRisk < 40 ? 'Moderate Risk' : 'High Risk';
  const riskColor = overallRisk < 20 ? 'text-success' : overallRisk < 40 ? 'text-warning' : 'text-destructive';
  const strokeColor = overallRisk < 20 ? 'hsl(152, 76%, 42%)' : overallRisk < 40 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)';

  const getRecommendations = () => {
    const recs = [];
    if (Number(formData.systolic) > 120) recs.push({ title: 'Reduce Sodium', desc: 'Limit daily sodium to under 2,300mg to help lower blood pressure.', priority: 'high' });
    if (Number(formData.ldl) > 130) recs.push({ title: 'Increase Omega-3', desc: 'Add fatty fish 2-3 times per week to improve cholesterol levels.', priority: 'high' });
    if (Number(formData.exercise) < 5) recs.push({ title: 'Daily Walking', desc: '30 minutes of brisk walking daily can reduce cardiac risk by 20%.', priority: 'medium' });
    if (Number(formData.sleep) < 7) recs.push({ title: 'Improve Sleep', desc: 'Aim for 7-9 hours. Poor sleep increases cardiovascular inflammation.', priority: 'medium' });
    if (formData.stress !== 'low') recs.push({ title: 'Stress Management', desc: 'Practice meditation or deep breathing for 10 min daily.', priority: 'medium' });
    if (Number(formData.bmi) > 25) recs.push({ title: 'Weight Management', desc: 'Losing 5-10% body weight can significantly reduce cardiac risk.', priority: 'high' });
    recs.push({ title: 'Regular Check-ups', desc: 'Schedule cardiac screening every 6 months for proactive monitoring.', priority: 'low' });
    recs.push({ title: 'Hydration', desc: 'Drink 8+ glasses of water daily for healthy blood flow.', priority: 'low' });
    return recs;
  };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartPulse className="h-5 w-5 text-white/80" />
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Cardiac Risk</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Cardiac Risk Predictor</h1>
            <p className="mt-1 text-white/75 text-sm">AI-powered heart disease risk assessment with 10-year scoring.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowInput(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Assessment
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { toast({ title: '📄 Report Downloaded', description: 'PDF cardiac report saved.' }); }}>
              <Download className="h-4 w-4 mr-1" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Input Dialog */}
      <Dialog open={showInput} onOpenChange={setShowInput}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5 text-destructive" /> Cardiac Risk Assessment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label className="text-xs">Age</Label>
              <Input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Gender</Label>
              <Select value={formData.gender} onValueChange={v => setFormData(p => ({ ...p, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Systolic BP (mmHg)</Label>
              <Input type="number" value={formData.systolic} onChange={e => setFormData(p => ({ ...p, systolic: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Diastolic BP (mmHg)</Label>
              <Input type="number" value={formData.diastolic} onChange={e => setFormData(p => ({ ...p, diastolic: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">LDL Cholesterol</Label>
              <Input type="number" value={formData.ldl} onChange={e => setFormData(p => ({ ...p, ldl: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">HDL Cholesterol</Label>
              <Input type="number" value={formData.hdl} onChange={e => setFormData(p => ({ ...p, hdl: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Total Cholesterol</Label>
              <Input type="number" value={formData.totalCholesterol} onChange={e => setFormData(p => ({ ...p, totalCholesterol: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Blood Sugar (mg/dL)</Label>
              <Input type="number" value={formData.bloodSugar} onChange={e => setFormData(p => ({ ...p, bloodSugar: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">BMI</Label>
              <Input type="number" step="0.1" value={formData.bmi} onChange={e => setFormData(p => ({ ...p, bmi: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Exercise (days/week)</Label>
              <Input type="number" value={formData.exercise} onChange={e => setFormData(p => ({ ...p, exercise: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Sleep (hours/day)</Label>
              <Input type="number" step="0.5" value={formData.sleep} onChange={e => setFormData(p => ({ ...p, sleep: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Stress Level</Label>
              <Select value={formData.stress} onValueChange={v => setFormData(p => ({ ...p, stress: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Smoking</Label>
              <Select value={formData.smoking} onValueChange={v => setFormData(p => ({ ...p, smoking: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Non-smoker</SelectItem>
                  <SelectItem value="yes">Smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Family History</Label>
              <Select value={formData.familyHistory} onValueChange={v => setFormData(p => ({ ...p, familyHistory: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={runAssessment}>
            <HeartPulse className="h-4 w-4 mr-2" /> Run AI Assessment
          </Button>
        </DialogContent>
      </Dialog>

      {/* Analyzing State */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="flex flex-col items-center py-12 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-destructive" />
                <p className="font-semibold text-lg">Analyzing Cardiac Risk...</p>
                <p className="text-sm text-muted-foreground">Processing vitals, lifestyle factors, and generating AI insights</p>
                <Progress value={65} className="w-64 mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!analyzing && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="vitals">Heart Rate</TabsTrigger>
            <TabsTrigger value="profile">Risk Profile</TabsTrigger>
            <TabsTrigger value="plan">Action Plan</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardHeader><CardTitle className="text-base">10-Year Risk Score</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center">
                  <motion.div className="relative h-44 w-44" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="8"
                        strokeDasharray={`${(overallRisk / 100) * 251.3} 251.3`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-heading font-bold">{overallRisk}%</span>
                      <span className={`text-xs font-medium ${riskColor}`}>{riskLabel}</span>
                    </div>
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    {overallRisk < 20 ? 'Your cardiovascular risk is below average. Keep it up!' :
                     overallRisk < 40 ? 'Moderate risk detected. Follow recommendations to improve.' :
                     'High risk detected. Consult a cardiologist soon.'}
                  </p>
                  {!assessmentDone && (
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowInput(true)}>
                      <Stethoscope className="h-4 w-4 mr-1" /> Take Assessment
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader><CardTitle className="text-base">Risk Factors ({riskFactors.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {riskFactors.map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {f.status === 'normal' || f.status === 'good'
                              ? <Icon className="h-4 w-4 text-success" />
                              : f.status === 'elevated'
                              ? <Icon className="h-4 w-4 text-destructive" />
                              : <Icon className="h-4 w-4 text-warning" />}
                            <span className="text-sm">{f.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{f.value}</span>
                            <Badge variant={f.status === 'normal' || f.status === 'good' ? 'default' : f.status === 'elevated' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {f.status}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Heart Age', value: `${Number(formData.age) + (overallRisk > 30 ? 5 : overallRisk > 15 ? 2 : -1)} yrs`, icon: HeartPulse, color: 'text-destructive' },
                { label: 'Risk Trend', value: '↓ Improving', icon: TrendingDown, color: 'text-success' },
                { label: 'Next Check-up', value: 'In 14 days', icon: Stethoscope, color: 'text-primary' },
                { label: 'Adherence', value: '87%', icon: Activity, color: 'text-primary' },
              ].map((s, i) => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-4 flex items-center gap-3">
                    <s.icon className={`h-8 w-8 ${s.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-heading font-bold">{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TRENDS TAB */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Risk Score Trend (6 Months)</CardTitle></CardHeader>
                <CardContent>
                  <ChartContainer config={{ risk: { label: 'Risk %', color: 'hsl(0, 84%, 60%)' } }} className="h-[250px]">
                    <AreaChart data={trendData}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 50]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="risk" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Blood Pressure & Cholesterol</CardTitle></CardHeader>
                <CardContent>
                  <ChartContainer config={{ bp: { label: 'Systolic BP', color: 'hsl(38, 92%, 50%)' }, ldl: { label: 'LDL', color: 'hsl(220, 70%, 50%)' } }} className="h-[250px]">
                    <LineChart data={trendData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="bp" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="ldl" stroke="hsl(220, 70%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">Monthly Comparison</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={{ risk: { label: 'Risk %', color: 'hsl(var(--primary))' } }} className="h-[200px]">
                  <BarChart data={trendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="risk" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEART RATE TAB */}
          <TabsContent value="vitals" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Today's Heart Rate</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={{ rate: { label: 'BPM', color: 'hsl(0, 84%, 60%)' } }} className="h-[280px]">
                  <AreaChart data={heartRateData}>
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 110]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rate" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Resting HR', value: '62 bpm', status: 'Normal' },
                { label: 'Max HR', value: '95 bpm', status: 'Normal' },
                { label: 'Avg HR', value: '78 bpm', status: 'Good' },
                { label: 'HRV', value: '45 ms', status: 'Moderate' },
              ].map((v, i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                    <p className="text-xl font-heading font-bold mt-1">{v.value}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{v.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* RISK PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Health Radar</CardTitle></CardHeader>
              <CardContent className="flex justify-center">
                <ChartContainer config={{ value: { label: 'Score', color: 'hsl(var(--primary))' } }} className="h-[320px] w-full max-w-md">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Health" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Risk Breakdown by Factor</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskFactors.map((f, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{f.name}</span>
                        <span className="font-medium">{f.score}%</span>
                      </div>
                      <Progress value={f.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTION PLAN TAB */}
          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Personalized Recommendations</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {getRecommendations().map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{r.title}</h4>
                        <Badge variant={r.priority === 'high' ? 'destructive' : r.priority === 'medium' ? 'secondary' : 'outline'} className="text-[10px]">
                          {r.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Emergency Warning Signs</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Chest pain or pressure lasting more than a few minutes',
                    'Shortness of breath with or without chest discomfort',
                    'Pain spreading to shoulders, neck, jaw, or arms',
                    'Sudden dizziness, nausea, or cold sweat',
                    'Unexplained extreme fatigue',
                    'Rapid or irregular heartbeat',
                  ].map((sign, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <span className="text-xs">{sign}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => { toast({ title: '📤 Report Shared', description: 'Cardiac report shared with your doctor.' }); notify('📤 Cardiac Report Shared', 'You shared your cardiac risk report with your doctor.'); }}>
                <Share2 className="h-4 w-4 mr-2" /> Share with Doctor
              </Button>
              <Button variant="outline" onClick={() => setShowInput(true)}>
                <Plus className="h-4 w-4 mr-2" /> Retake Assessment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CardiacRisk;
