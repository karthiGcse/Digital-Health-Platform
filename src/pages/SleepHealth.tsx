import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Moon, Clock, TrendingUp, Zap, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sleepData = [
  { day: 'Mon', hours: 7.2 }, { day: 'Tue', hours: 6.5 }, { day: 'Wed', hours: 7.8 },
  { day: 'Thu', hours: 6.1 }, { day: 'Fri', hours: 7.5 }, { day: 'Sat', hours: 8.2 }, { day: 'Sun', hours: 7.9 },
];

const SleepHealth = () => (
  <div className="space-y-6">
    <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Moon className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Sleep</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Sleep Health Tracker</h1>
        <p className="mt-1 text-white/75 text-sm">Monitor and improve your sleep quality with AI insights.</p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Avg Sleep', value: '7.3h', icon: Clock, iconClass: 'stat-icon-blue' },
        { label: 'Sleep Score', value: '82', icon: Star, iconClass: 'stat-icon-green' },
        { label: 'Deep Sleep', value: '1.8h', icon: Moon, iconClass: 'stat-icon-purple' },
        { label: 'Energy', value: 'Good', icon: Zap, iconClass: 'stat-icon-orange' },
      ].map(s => (
        <Card key={s.label} className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Sleep Duration (7 Days)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={sleepData}>
            <defs><linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(271, 81%, 56%)" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(271, 81%, 56%)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="hours" stroke="hsl(271, 81%, 56%)" fill="url(#sleepGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">AI Recommendations</CardTitle></CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Optimize Bedtime', desc: 'Going to bed at 10:30 PM aligns with your circadian rhythm.' },
            { title: 'Reduce Blue Light', desc: 'Avoid screens 1 hour before bed for better melatonin production.' },
            { title: 'Room Temperature', desc: 'Keep bedroom at 18-20°C for optimal sleep quality.' },
          ].map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50"><h4 className="font-semibold text-sm mb-1">{r.title}</h4><p className="text-xs text-muted-foreground">{r.desc}</p></div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SleepHealth;
