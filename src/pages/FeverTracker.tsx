import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThermometerSun, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const tempData = [
  { time: '6AM', temp: 36.5 }, { time: '9AM', temp: 36.8 }, { time: '12PM', temp: 37.1 },
  { time: '3PM', temp: 37.8 }, { time: '6PM', temp: 37.4 }, { time: '9PM', temp: 37.0 },
];

const FeverTracker = () => (
  <div className="space-y-6">
    <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><ThermometerSun className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Fever Tracker</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Fever & Infection Tracker</h1>
        <p className="mt-1 text-white/75 text-sm">Smart thermometer integration with infection pattern detection.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><ThermometerSun className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">37.0°C</p><p className="text-xs text-muted-foreground">Current Temp</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Normal</p><p className="text-xs text-muted-foreground">Status</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">37.8°C</p><p className="text-xs text-muted-foreground">Peak Today</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Temperature Timeline</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={tempData}>
            <defs><linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis domain={[35, 40]} axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="temp" stroke="hsl(38, 92%, 50%)" fill="url(#tempGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default FeverTracker;
