import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleDot, MapPin, Heart, Calendar, Users, Bell } from 'lucide-react';

const requests = [
  { bloodType: 'O+', hospital: 'City General Hospital', urgency: 'Urgent', distance: '3 km', units: 2 },
  { bloodType: 'A-', hospital: 'Apollo Healthcare', urgency: 'Normal', distance: '8 km', units: 1 },
  { bloodType: 'B+', hospital: 'Max Super Specialty', urgency: 'Critical', distance: '5 km', units: 3 },
];

const BloodDonation = () => (
  <div className="space-y-6">
    <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><CircleDot className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Blood Donation</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Blood Donation Network</h1>
        <p className="mt-1 text-white/75 text-sm">Connect blood donors with nearby recipients in real-time.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-4 gap-4">
      {[
        { label: 'Your Type', value: 'O+', icon: CircleDot, iconClass: 'stat-icon-red' },
        { label: 'Donations', value: '6', icon: Heart, iconClass: 'stat-icon-green' },
        { label: 'Last Donated', value: 'Jan 15', icon: Calendar, iconClass: 'stat-icon-blue' },
        { label: 'Lives Saved', value: '18', icon: Users, iconClass: 'stat-icon-purple' },
      ].map(s => (
        <Card key={s.label} className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Active Blood Requests Near You</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center"><span className="text-sm font-bold text-destructive">{r.bloodType}</span></div>
                <div><p className="font-medium text-sm">{r.hospital}</p><p className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline" /> {r.distance} • {r.units} units needed</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.urgency === 'Critical' ? 'destructive' : r.urgency === 'Urgent' ? 'default' : 'secondary'}>{r.urgency}</Badge>
                <Button size="sm">Donate</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BloodDonation;
