import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Baby, Calendar, TrendingUp, Heart, Stethoscope, Bell } from 'lucide-react';

const milestones = [
  { week: 'Week 12', title: 'First Trimester Complete', desc: 'Baby is about 2 inches long', completed: true },
  { week: 'Week 20', title: 'Anatomy Scan', desc: 'Detailed ultrasound to check baby development', completed: true },
  { week: 'Week 28', title: 'Third Trimester Begins', desc: 'Baby can open eyes and respond to light', completed: false },
  { week: 'Week 36', title: 'Full Term Approaching', desc: 'Baby gaining about 1 oz per day', completed: false },
  { week: 'Week 40', title: 'Due Date', desc: 'Expected delivery date', completed: false },
];

const MaternalHealth = () => (
  <div className="space-y-6">
    <div className="page-header gradient-success animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Baby className="h-5 w-5 text-white/80" />
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Maternal Health</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Maternal & Child Health Tracker</h1>
        <p className="mt-1 text-white/75 text-sm">Pregnancy monitoring, baby milestones, and pediatric care.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-4 gap-4">
      {[
        { label: 'Current Week', value: '24', icon: Calendar, iconClass: 'stat-icon-blue' },
        { label: 'Baby Size', value: '~1.3 lb', icon: Baby, iconClass: 'stat-icon-green' },
        { label: 'Next Checkup', value: 'Mar 15', icon: Stethoscope, iconClass: 'stat-icon-purple' },
        { label: 'Health Score', value: '96%', icon: Heart, iconClass: 'stat-icon-green' },
      ].map(s => (
        <Card key={s.label} className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Pregnancy Milestones</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                {m.completed ? <TrendingUp className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{m.title}</h4>
                  <Badge variant="secondary" className="text-[10px]">{m.week}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default MaternalHealth;
