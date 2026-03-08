import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonStanding, AlertTriangle, Bell, Phone, Activity, Shield } from 'lucide-react';

const alerts = [
  { time: '2026-03-07 14:32', type: 'Movement Alert', message: 'Unusual inactivity detected for 3 hours', severity: 'warning' },
  { time: '2026-03-05 09:15', type: 'Fall Detected', message: 'Possible fall detected in living room - User responded OK', severity: 'resolved' },
  { time: '2026-03-02 18:45', type: 'Activity Normal', message: 'Daily activity pattern within normal range', severity: 'normal' },
];

const FallDetection = () => {
  const [monitoring, setMonitoring] = useState(true);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><PersonStanding className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Fall Detection</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Elderly Fall Detection</h1>
          <p className="mt-1 text-white/75 text-sm">Smart fall detection and emergency alerts for seniors.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Shield className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{monitoring ? 'Active' : 'Off'}</p><p className="text-xs text-muted-foreground">Monitoring</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Activity className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Normal</p><p className="text-xs text-muted-foreground">Activity Level</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Bell className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">1</p><p className="text-xs text-muted-foreground">Alerts This Week</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Emergency Contacts</CardTitle>
            <Button size="sm" variant="outline"><Phone className="h-3 w-3 mr-1" /> Add Contact</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[{ name: 'Dr. Sharma', relation: 'Primary Doctor', phone: '+91 98765 43210' }, { name: 'Priya Sharma', relation: 'Daughter', phone: '+91 98765 12345' }].map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50 flex items-center justify-between">
                <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-muted-foreground">{c.relation}</p></div>
                <Button size="sm" variant="outline"><Phone className="h-3 w-3 mr-1" /> Call</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Alerts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={a.severity === 'normal' ? 'stat-icon-green' : a.severity === 'resolved' ? 'stat-icon-blue' : 'stat-icon-orange'}><AlertTriangle className="h-4 w-4" /></div>
                  <div><p className="font-medium text-sm">{a.type}</p><p className="text-xs text-muted-foreground">{a.message}</p></div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FallDetection;
