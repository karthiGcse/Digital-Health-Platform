import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Play, CheckCircle2, Clock, TrendingUp, Target } from 'lucide-react';

const exercises = [
  { name: 'Knee Extension', sets: '3 x 12', duration: '5 min', completed: true, difficulty: 'Easy' },
  { name: 'Hip Bridge', sets: '3 x 10', duration: '4 min', completed: true, difficulty: 'Easy' },
  { name: 'Wall Squat Hold', sets: '3 x 30s', duration: '3 min', completed: false, difficulty: 'Medium' },
  { name: 'Calf Raises', sets: '3 x 15', duration: '4 min', completed: false, difficulty: 'Easy' },
  { name: 'Resistance Band Walk', sets: '2 x 20 steps', duration: '5 min', completed: false, difficulty: 'Medium' },
];

const Physiotherapy = () => {
  const [completedEx, setCompletedEx] = useState(new Set([0, 1]));
  const progress = (completedEx.size / exercises.length) * 100;

  const toggleComplete = (idx: number) => {
    setCompletedEx(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-health animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Physiotherapy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Physiotherapy & Rehab Coach</h1>
          <p className="mt-1 text-white/75 text-sm">AI-guided exercise programs for injury recovery.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Target className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{Math.round(progress)}%</p><p className="text-xs text-muted-foreground">Today's Progress</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Day 14</p><p className="text-xs text-muted-foreground">Recovery Day</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Clock className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">21 min</p><p className="text-xs text-muted-foreground">Est. Duration</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today's Exercise Plan</CardTitle>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${completedEx.has(i) ? 'bg-success/10' : 'bg-muted/50'}`}>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant={completedEx.has(i) ? 'default' : 'outline'} className={completedEx.has(i) ? 'bg-success hover:bg-success/90' : ''} onClick={() => toggleComplete(i)}>
                    {completedEx.has(i) ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div>
                    <p className={`font-medium text-sm ${completedEx.has(i) ? 'line-through text-muted-foreground' : ''}`}>{ex.name}</p>
                    <p className="text-xs text-muted-foreground">{ex.sets} • {ex.duration}</p>
                  </div>
                </div>
                <Badge variant="secondary">{ex.difficulty}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Physiotherapy;
