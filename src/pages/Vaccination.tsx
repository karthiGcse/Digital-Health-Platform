import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Syringe, Calendar, Baby, Plane, Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const vaccineSchedule = [
  { name: 'COVID-19 Booster', date: '2026-04-15', status: 'upcoming', type: 'Booster' },
  { name: 'Influenza (Flu)', date: '2026-03-20', status: 'upcoming', type: 'Annual' },
  { name: 'Tetanus (Td/Tdap)', date: '2025-12-10', status: 'completed', type: 'Booster' },
  { name: 'Hepatitis B', date: '2025-08-05', status: 'completed', type: 'Series' },
  { name: 'MMR', date: '2024-06-15', status: 'completed', type: 'Childhood' },
];

const travelVaccines = [
  { destination: 'Southeast Asia', vaccines: ['Typhoid', 'Hepatitis A', 'Japanese Encephalitis'], risk: 'Medium' },
  { destination: 'Sub-Saharan Africa', vaccines: ['Yellow Fever', 'Malaria Prophylaxis', 'Meningitis'], risk: 'High' },
  { destination: 'South America', vaccines: ['Yellow Fever', 'Typhoid', 'Hepatitis A'], risk: 'Medium' },
];

const Vaccination = () => {
  const [reminder, setReminder] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Syringe className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Vaccination</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Smart Vaccination Scheduler</h1>
          <p className="mt-1 text-white/75 text-sm">Automated vaccination scheduling for all age groups with booster reminders.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">12</p><p className="text-xs text-muted-foreground">Completed</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Clock className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Upcoming</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Calendar className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">85%</p><p className="text-xs text-muted-foreground">Coverage</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Vaccine Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vaccineSchedule.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={v.status === 'completed' ? 'stat-icon-green' : 'stat-icon-orange'}><Syringe className="h-4 w-4" /></div>
                  <div><p className="font-medium text-sm">{v.name}</p><p className="text-xs text-muted-foreground">{v.date}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.status === 'completed' ? 'default' : 'secondary'}>{v.type}</Badge>
                  {v.status === 'upcoming' && (
                    <Button size="sm" variant="outline" onClick={() => setReminder(v.name)}>
                      <Bell className="h-3 w-3 mr-1" /> {reminder === v.name ? 'Reminded!' : 'Remind'}
                    </Button>
                  )}
                  {v.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plane className="h-4 w-4" /> Travel Vaccine Advisor</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {travelVaccines.map((t, i) => (
              <div key={i} className="p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">{t.destination}</h4>
                  <Badge variant={t.risk === 'High' ? 'destructive' : 'secondary'}>{t.risk} Risk</Badge>
                </div>
                <ul className="space-y-1">{t.vaccines.map((v, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-primary" />{v}</li>
                ))}</ul>
                <Button size="sm" className="w-full mt-3" variant="outline">Schedule All</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vaccination;
