import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Move3D, Play, Clock, Heart, Flame, CheckCircle2 } from 'lucide-react';

const sessions = [
  { name: 'Morning Sun Salutation', duration: '15 min', difficulty: 'Beginner', calories: 80, type: 'Yoga' },
  { name: 'Stress Relief Meditation', duration: '10 min', difficulty: 'All Levels', calories: 20, type: 'Meditation' },
  { name: 'Power Vinyasa Flow', duration: '30 min', difficulty: 'Intermediate', calories: 200, type: 'Yoga' },
  { name: 'Body Scan Relaxation', duration: '20 min', difficulty: 'Beginner', calories: 15, type: 'Meditation' },
  { name: 'Deep Breathing Pranayama', duration: '10 min', difficulty: 'All Levels', calories: 25, type: 'Breathing' },
];

const Yoga = () => {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-success animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><Move3D className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Yoga & Meditation</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Yoga & Meditation Guide</h1>
          <p className="mt-1 text-white/75 text-sm">AI-guided yoga sessions and meditation programs.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Sessions Done', value: '42', icon: CheckCircle2, iconClass: 'stat-icon-green' },
          { label: 'Total Minutes', value: '890', icon: Clock, iconClass: 'stat-icon-blue' },
          { label: 'Calories Burned', value: '3,200', icon: Flame, iconClass: 'stat-icon-orange' },
          { label: 'Streak', value: '7 days', icon: Heart, iconClass: 'stat-icon-purple' },
        ].map(s => (
          <Card key={s.label} className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recommended Sessions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${playing === i ? 'bg-primary/10' : 'bg-muted/50'}`}>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant={playing === i ? 'default' : 'outline'} onClick={() => setPlaying(playing === i ? null : i)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.duration} • {s.calories} cal</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{s.type}</Badge>
                  <Badge variant="outline">{s.difficulty}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Yoga;
