import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Watch, Heart, Footprints, Flame, Moon, Droplets, Activity, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  bpm: 60 + Math.floor(Math.random() * 40) + (i > 6 && i < 22 ? 15 : 0),
}));

const stepsData = [
  { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 6800 }, { day: 'Wed', steps: 10400 },
  { day: 'Thu', steps: 7500 }, { day: 'Fri', steps: 9100 }, { day: 'Sat', steps: 12000 }, { day: 'Sun', steps: 5400 },
];

const devices = [
  { name: 'Apple Watch Series 9', type: 'Smartwatch', connected: true, battery: 72, lastSync: '2 min ago' },
  { name: 'Fitbit Charge 6', type: 'Fitness Tracker', connected: false, battery: 45, lastSync: '3 hours ago' },
  { name: 'Oura Ring Gen 3', type: 'Sleep Tracker', connected: true, battery: 88, lastSync: '10 min ago' },
];

const vitals = [
  { label: 'Heart Rate', value: '72 bpm', icon: Heart, trend: 'Normal', color: 'text-destructive', bg: 'bg-destructive/10' },
  { label: 'Steps Today', value: '8,432', icon: Footprints, trend: '+12%', color: 'text-success', bg: 'bg-success/10' },
  { label: 'Calories', value: '1,847 kcal', icon: Flame, trend: 'On track', color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Sleep Score', value: '85/100', icon: Moon, trend: 'Good', color: 'text-info', bg: 'bg-info/10' },
  { label: 'SpO2', value: '98%', icon: Droplets, trend: 'Normal', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Stress Level', value: 'Low', icon: Activity, trend: '↓ Improving', color: 'text-success', bg: 'bg-success/10' },
];

const WearableIntegration = () => {
  const [selectedDevice, setSelectedDevice] = useState(0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-green-600 to-teal-600 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Watch className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Wearable Device Integration</h1>
          </div>
          <p className="text-white/80 text-sm">Connect your fitness trackers and smartwatches for real-time health monitoring.</p>
        </div>
        <Watch className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Devices */}
      <div className="grid sm:grid-cols-3 gap-4">
        {devices.map((d, i) => (
          <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`rounded-card cursor-pointer transition-all ${selectedDevice === i ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedDevice(i)}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Watch className="h-5 w-5 text-primary" />
                  {d.connected ? <Badge className="bg-success/10 text-success border-0 text-xs gap-1"><Wifi className="h-3 w-3" /> Connected</Badge>
                    : <Badge variant="outline" className="text-muted-foreground text-xs gap-1"><WifiOff className="h-3 w-3" /> Offline</Badge>}
                </div>
                <h4 className="font-medium text-sm">{d.name}</h4>
                <p className="text-xs text-muted-foreground">{d.type}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>🔋 {d.battery}%</span>
                  <span>Synced {d.lastSync}</span>
                </div>
                <Progress value={d.battery} className="h-1" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vitals.map((v, i) => (
          <motion.div key={v.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-card">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg ${v.bg} w-fit mb-2`}><v.icon className={`h-4 w-4 ${v.color}`} /></div>
                <p className="text-xs text-muted-foreground">{v.label}</p>
                <p className="text-lg font-bold">{v.value}</p>
                <p className={`text-xs ${v.color}`}>{v.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="rounded-card">
          <CardHeader><CardTitle className="text-sm">Heart Rate (24h)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} domain={[50, 120]} className="text-muted-foreground" />
                <Tooltip />
                <Area type="monotone" dataKey="bpm" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader><CardTitle className="text-sm">Weekly Steps</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="rounded-card border-warning/30">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-warning" /> Smart Health Alerts</h4>
          <div className="space-y-2">
            {[
              { msg: 'Resting heart rate elevated (78 bpm avg). Consider stress management.', severity: 'warning', time: '2h ago' },
              { msg: 'Great job! You hit your 10,000 steps goal on Wednesday.', severity: 'success', time: '1d ago' },
              { msg: 'Sleep quality dropped 15% this week. Try consistent bedtime.', severity: 'info', time: '2d ago' },
            ].map((a, i) => (
              <div key={i} className={`p-3 rounded-lg text-xs ${a.severity === 'warning' ? 'bg-warning/10 text-warning' : a.severity === 'success' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                <div className="flex justify-between"><span>{a.msg}</span><span className="text-muted-foreground shrink-0 ml-2">{a.time}</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearableIntegration;
