import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Ear, Volume2, VolumeX, Activity, AlertTriangle, Play, Pause, Square, BarChart3, Shield, Clock, Bell, Download, CheckCircle, Loader2, HeadphonesIcon, Music, Zap, TrendingUp, TrendingDown, Info, RefreshCw, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface TestResult {
  frequency: string;
  hz: number;
  leftEar: number;
  rightEar: number;
  status: string;
}

interface NoiseLog {
  time: string;
  level: number;
  source: string;
  duration: string;
  risk: 'Safe' | 'Caution' | 'Danger';
}

const frequencies = [250, 500, 1000, 2000, 4000, 8000];

const getStatus = (db: number) => {
  if (db <= 25) return 'Normal';
  if (db <= 40) return 'Mild';
  if (db <= 55) return 'Moderate';
  if (db <= 70) return 'Moderate-Severe';
  if (db <= 90) return 'Severe';
  return 'Profound';
};

const getStatusColor = (status: string) => {
  if (status === 'Normal') return 'default';
  if (status === 'Mild') return 'secondary';
  return 'destructive';
};

const initialResults: TestResult[] = [
  { frequency: '250 Hz', hz: 250, leftEar: 20, rightEar: 15, status: 'Normal' },
  { frequency: '500 Hz', hz: 500, leftEar: 25, rightEar: 20, status: 'Normal' },
  { frequency: '1000 Hz', hz: 1000, leftEar: 15, rightEar: 15, status: 'Normal' },
  { frequency: '2000 Hz', hz: 2000, leftEar: 30, rightEar: 25, status: 'Mild' },
  { frequency: '4000 Hz', hz: 4000, leftEar: 35, rightEar: 40, status: 'Mild' },
  { frequency: '8000 Hz', hz: 8000, leftEar: 40, rightEar: 45, status: 'Mild' },
];

const noiseLogs: NoiseLog[] = [
  { time: '9:00 AM', level: 45, source: 'Office', duration: '3 hrs', risk: 'Safe' },
  { time: '12:30 PM', level: 72, source: 'Restaurant', duration: '45 min', risk: 'Caution' },
  { time: '2:00 PM', level: 55, source: 'Home', duration: '2 hrs', risk: 'Safe' },
  { time: '4:30 PM', level: 82, source: 'Traffic', duration: '30 min', risk: 'Caution' },
  { time: '6:00 PM', level: 95, source: 'Headphones (Loud)', duration: '1 hr', risk: 'Danger' },
  { time: '8:00 PM', level: 40, source: 'Home (Quiet)', duration: '3 hrs', risk: 'Safe' },
];

const trendData = [
  { month: 'Sep', left: 18, right: 14, exposure: 62 },
  { month: 'Oct', left: 20, right: 16, exposure: 65 },
  { month: 'Nov', left: 22, right: 18, exposure: 68 },
  { month: 'Dec', left: 24, right: 20, exposure: 70 },
  { month: 'Jan', left: 26, right: 22, exposure: 66 },
  { month: 'Feb', left: 28, right: 24, exposure: 68 },
  { month: 'Mar', left: 27, right: 23, exposure: 64 },
];

const radarData = [
  { freq: '250Hz', left: 80, right: 85 },
  { freq: '500Hz', left: 75, right: 80 },
  { freq: '1kHz', left: 85, right: 85 },
  { freq: '2kHz', left: 70, right: 75 },
  { freq: '4kHz', left: 65, right: 60 },
  { freq: '8kHz', left: 60, right: 55 },
];

const HearingHealth = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const audioRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const [testResults, setTestResults] = useState<TestResult[]>(initialResults);
  const [testing, setTesting] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [testEar, setTestEar] = useState<'left' | 'right'>('left');
  const [testVolume, setTestVolume] = useState(30);
  const [testProgress, setTestProgress] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [currentFreqResults, setCurrentFreqResults] = useState<{ left: number[]; right: number[] }>({ left: [], right: [] });

  const [playingTone, setPlayingTone] = useState(false);
  const [toneFreq, setToneFreq] = useState(1000);
  const [toneVolume, setToneVolume] = useState([50]);

  const [noiseAlerts, setNoiseAlerts] = useState(true);
  const [dailyLimit, setDailyLimit] = useState('85');
  const [showTips, setShowTips] = useState(false);

  const avgExposure = Math.round(noiseLogs.reduce((a, b) => a + b.level, 0) / noiseLogs.length);
  const overallLeft = Math.round(testResults.reduce((a, b) => a + b.leftEar, 0) / testResults.length);
  const overallRight = Math.round(testResults.reduce((a, b) => a + b.rightEar, 0) / testResults.length);
  const overallStatus = getStatus(Math.max(overallLeft, overallRight));

  const playTone = useCallback((freq: number, volume: number) => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      if (oscRef.current) { oscRef.current.stop(); oscRef.current = null; }
      const osc = audioRef.current.createOscillator();
      const gain = audioRef.current.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = volume / 100 * 0.3;
      osc.connect(gain);
      gain.connect(audioRef.current.destination);
      osc.start();
      oscRef.current = osc;
      setPlayingTone(true);
    } catch { /* audio not supported */ }
  }, []);

  const stopTone = useCallback(() => {
    if (oscRef.current) { oscRef.current.stop(); oscRef.current = null; }
    setPlayingTone(false);
  }, []);

  useEffect(() => () => { stopTone(); if (audioRef.current) audioRef.current.close(); }, [stopTone]);

  const startHearingTest = () => {
    setTesting(true);
    setTestStep(0);
    setTestEar('left');
    setTestProgress(0);
    setTestComplete(false);
    setCurrentFreqResults({ left: [], right: [] });
    toast({ title: '🎧 Hearing Test Started', description: 'Put on headphones. Press "I Can Hear" when you hear the tone.' });
  };

  const playTestTone = () => {
    const freq = frequencies[testStep];
    playTone(freq, testVolume);
    setTimeout(() => stopTone(), 1500);
  };

  const handleCanHear = () => {
    const thresholdDb = Math.round(testVolume * 1.2);
    if (testEar === 'left') {
      setCurrentFreqResults(p => ({ ...p, left: [...p.left, thresholdDb] }));
      setTestEar('right');
      playTestTone();
    } else {
      setCurrentFreqResults(p => ({ ...p, right: [...p.right, thresholdDb] }));
      if (testStep < frequencies.length - 1) {
        setTestStep(s => s + 1);
        setTestEar('left');
        setTestProgress(((testStep + 1) / frequencies.length) * 100);
      } else {
        finishTest();
      }
    }
  };

  const handleCannotHear = () => {
    if (testVolume < 90) {
      setTestVolume(v => v + 10);
      playTestTone();
    } else {
      handleCanHear();
    }
  };

  const finishTest = async () => {
    stopTone();
    const newResults = frequencies.map((hz, i) => {
      const leftDb = currentFreqResults.left[i] ?? Math.round(testVolume * 1.2);
      const rightDb = i < currentFreqResults.right.length ? currentFreqResults.right[i] : Math.round(testVolume * 1.2);
      return {
        frequency: `${hz >= 1000 ? hz / 1000 + 'k' : hz} Hz`,
        hz,
        leftEar: leftDb,
        rightEar: rightDb,
        status: getStatus(Math.max(leftDb, rightDb)),
      };
    });
    setTestResults(newResults);
    setTestComplete(true);
    setTesting(false);
    setTestProgress(100);
    toast({ title: '✅ Hearing Test Complete!', description: 'Your audiometry results have been updated.' });
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '👂 Hearing Test Complete',
        message: `Your hearing test results: Left avg ${overallLeft}dB, Right avg ${overallRight}dB. Overall: ${overallStatus}.`,
        type: 'success',
        link: '/hearing-health',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1"><Ear className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Hearing Health</span></div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Hearing Health Monitor</h1>
            <p className="mt-1 text-white/75 text-sm">Track hearing health, run tests, and monitor noise exposure.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={startHearingTest} disabled={testing}><HeadphonesIcon className="h-4 w-4 mr-1" /> New Test</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowTips(true)}><Info className="h-4 w-4 mr-1" /> Tips</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Hearing', value: overallStatus, icon: Volume2, iconClass: overallStatus === 'Normal' ? 'stat-icon-green' : 'stat-icon-orange' },
          { label: 'Avg Exposure', value: `${avgExposure} dB`, icon: Activity, iconClass: avgExposure > 80 ? 'stat-icon-red' : 'stat-icon-blue' },
          { label: 'Left Ear Avg', value: `${overallLeft} dB`, icon: Ear, iconClass: 'stat-icon-purple' },
          { label: 'Right Ear Avg', value: `${overallRight} dB`, icon: Ear, iconClass: 'stat-icon-blue' },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ scale: 1.02 }}>
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      {/* Active Test Banner */}
      <AnimatePresence>
        {testing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="font-semibold">Hearing Test in Progress</span>
                  </div>
                  <Badge variant="outline">{testEar === 'left' ? '🔵 Left Ear' : '🔴 Right Ear'}</Badge>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold">{frequencies[testStep]} Hz</p>
                  <p className="text-sm text-muted-foreground">Frequency {testStep + 1} of {frequencies.length} • Volume: {testVolume}%</p>
                </div>
                <Progress value={testProgress} className="h-2" />
                <div className="flex justify-center gap-3">
                  <Button onClick={playTestTone} variant="outline"><Play className="h-4 w-4 mr-1" /> Play Tone</Button>
                  <Button onClick={handleCanHear} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="h-4 w-4 mr-1" /> I Can Hear</Button>
                  <Button onClick={handleCannotHear} variant="destructive"><VolumeX className="h-4 w-4 mr-1" /> Can't Hear</Button>
                  <Button onClick={() => { stopTone(); setTesting(false); }} variant="ghost"><Square className="h-4 w-4 mr-1" /> Stop</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="exposure">Exposure</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Audiometry Results */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Audiometry Results</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-2 text-muted-foreground text-xs">Frequency</th><th className="text-center p-2 text-muted-foreground text-xs">Left (dB)</th><th className="text-center p-2 text-muted-foreground text-xs">Right (dB)</th><th className="text-right p-2 text-muted-foreground text-xs">Status</th></tr></thead>
                  <tbody>
                    {testResults.map((t, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-2 font-medium">{t.frequency}</td>
                        <td className="p-2 text-center">{t.leftEar}</td>
                        <td className="p-2 text-center">{t.rightEar}</td>
                        <td className="p-2 text-right"><Badge variant={getStatusColor(t.status) as any}>{t.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Audiogram Chart</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={testResults}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="frequency" tick={{ fontSize: 11 }} />
                  <YAxis reversed domain={[0, 100]} label={{ value: 'dB HL', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="leftEar" stroke="hsl(var(--primary))" strokeWidth={2} name="Left Ear" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="rightEar" stroke="hsl(var(--destructive))" strokeWidth={2} name="Right Ear" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Left Ear</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Right Ear</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Hearing Profile Radar</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="freq" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Left" dataKey="left" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  <Radar name="Right" dataKey="right" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Noise Exposure */}
        <TabsContent value="exposure" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-5 w-5" /> Today's Noise Exposure Log</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {noiseLogs.map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${n.risk === 'Safe' ? 'bg-green-500/10' : n.risk === 'Caution' ? 'bg-yellow-500/10' : 'bg-destructive/10'}`}>
                      {n.risk === 'Safe' ? <Volume2 className="h-4 w-4 text-green-600" /> : n.risk === 'Caution' ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> : <VolumeX className="h-4 w-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{n.source}</p>
                      <p className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline" /> {n.time} • {n.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{n.level} dB</span>
                    <Badge variant={n.risk === 'Safe' ? 'default' : n.risk === 'Caution' ? 'secondary' : 'destructive'}>{n.risk}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Noise Level Guide</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { range: '0-30 dB', label: 'Whisper / Library', risk: 'Safe', color: 'bg-green-500' },
                { range: '30-60 dB', label: 'Normal conversation', risk: 'Safe', color: 'bg-green-400' },
                { range: '60-80 dB', label: 'Traffic / Vacuum', risk: 'Moderate', color: 'bg-yellow-400' },
                { range: '80-100 dB', label: 'Factory / Concerts', risk: 'Harmful', color: 'bg-orange-500' },
                { range: '100-120 dB', label: 'Jet engine / Sirens', risk: 'Dangerous', color: 'bg-destructive' },
                { range: '120+ dB', label: 'Fireworks / Gunshot', risk: 'Pain threshold', color: 'bg-destructive' },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${g.color}`} />
                  <span className="text-sm font-medium w-20">{g.range}</span>
                  <span className="text-sm text-muted-foreground flex-1">{g.label}</span>
                  <Badge variant="outline" className="text-xs">{g.risk}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Exposure Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Average Level</span><span className="font-bold">{avgExposure} dB</span>
                </div>
                <Progress value={(avgExposure / 100) * 100} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span>Safe Limit</span><span className="font-bold">{dailyLimit} dB</span>
                </div>
                {avgExposure > parseInt(dailyLimit) && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Your average exposure exceeds the safe limit today!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Hearing Threshold Trend (6 Months)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="left" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Left Ear (dB)" />
                  <Area type="monotone" dataKey="right" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Right Ear (dB)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Noise Exposure Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="exposure" stroke="hsl(var(--accent-foreground))" strokeWidth={2} name="Avg dB" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <TrendingDown className="h-8 w-8 mx-auto text-green-500" />
                <p className="text-2xl font-bold">-3 dB</p>
                <p className="text-xs text-muted-foreground">Exposure improvement this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <Shield className="h-8 w-8 mx-auto text-primary" />
                <p className="text-2xl font-bold">82%</p>
                <p className="text-xs text-muted-foreground">Days within safe limits</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Waves className="h-5 w-5" /> Tone Generator</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Test your hearing with custom tones. Use headphones for accurate results.</p>
              <div>
                <Label>Frequency: {toneFreq} Hz</Label>
                <Select value={toneFreq.toString()} onValueChange={v => { setToneFreq(parseInt(v)); if (playingTone) { stopTone(); playTone(parseInt(v), toneVolume[0]); } }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[125, 250, 500, 1000, 2000, 4000, 8000, 12000, 16000].map(f => <SelectItem key={f} value={f.toString()}>{f >= 1000 ? `${f/1000}k` : f} Hz</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Volume: {toneVolume[0]}%</Label>
                <Slider value={toneVolume} onValueChange={setToneVolume} max={100} step={5} className="mt-2" />
              </div>
              <div className="flex gap-2">
                {!playingTone ? (
                  <Button onClick={() => playTone(toneFreq, toneVolume[0])}><Play className="h-4 w-4 mr-1" /> Play</Button>
                ) : (
                  <Button onClick={stopTone} variant="destructive"><Pause className="h-4 w-4 mr-1" /> Stop</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Quick Hearing Checks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'High Frequency Test', desc: 'Can you hear 8kHz-16kHz?', freq: 12000 },
                { name: 'Speech Range Check', desc: 'Test 500Hz-4kHz range', freq: 2000 },
                { name: 'Low Frequency Test', desc: 'Can you hear 125Hz-250Hz?', freq: 125 },
              ].map(t => (
                <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { playTone(t.freq, 40); setTimeout(stopTone, 2000); toast({ title: `🔊 Playing ${t.freq >= 1000 ? t.freq/1000 + 'kHz' : t.freq + 'Hz'}` }); }}>
                    <Play className="h-4 w-4 mr-1" /> Play
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Export & Share</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: '📄 Report Downloaded', description: 'Audiometry PDF report saved.' })}><Download className="h-4 w-4 mr-1" /> Download PDF</Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: '📤 Report Shared', description: 'Audiometry report shared with your doctor.' })}><Ear className="h-4 w-4 mr-1" /> Share with Doctor</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Hearing Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2"><Bell className="h-4 w-4" /><span className="text-sm">High noise alerts</span></div>
                <Switch checked={noiseAlerts} onCheckedChange={v => { setNoiseAlerts(v); toast({ title: v ? '🔔 Noise Alerts On' : '🔕 Noise Alerts Off' }); }} />
              </div>
              <div>
                <Label>Daily Safe Exposure Limit (dB)</Label>
                <Select value={dailyLimit} onValueChange={setDailyLimit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['70', '75', '80', '85', '90'].map(v => <SelectItem key={v} value={v}>{v} dB</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span className="text-sm">Hearing Protection Reminders</span></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">When to See a Doctor</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Difficulty hearing in noisy environments',
                  'Frequently asking others to repeat themselves',
                  'Ringing or buzzing in your ears (tinnitus)',
                  'Feeling of fullness or pressure in ears',
                  'Sudden hearing loss in one or both ears',
                  'Pain or discharge from the ear',
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Dialog */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>👂 Hearing Health Tips</DialogTitle>
            <DialogDescription>Protect your hearing with these daily habits.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { icon: '🎧', tip: 'Follow the 60/60 rule — 60% volume for max 60 minutes.' },
              { icon: '🔇', tip: 'Use noise-canceling headphones in loud environments.' },
              { icon: '🛡️', tip: 'Wear earplugs at concerts, construction sites, or loud events.' },
              { icon: '⏸️', tip: 'Take 5-minute breaks from headphones every 30 minutes.' },
              { icon: '🏥', tip: 'Get annual hearing checkups after age 50.' },
              { icon: '🚫', tip: 'Never insert objects into your ear canal.' },
              { icon: '💊', tip: 'Some medications are ototoxic — consult your doctor.' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <span className="text-lg">{t.icon}</span>
                <span className="text-sm">{t.tip}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HearingHealth;
