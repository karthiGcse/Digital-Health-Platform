import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Bed, AlertTriangle, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const hospitals = [
  { name: 'City General Hospital', distance: '2 km', totalBeds: 500, available: 42, icu: 3, emergency: true },
  { name: 'Apollo Healthcare', distance: '5 km', totalBeds: 800, available: 78, icu: 8, emergency: true },
  { name: 'Max Super Specialty', distance: '8 km', totalBeds: 600, available: 15, icu: 0, emergency: false },
  { name: 'Fortis Medical Center', distance: '12 km', totalBeds: 400, available: 55, icu: 5, emergency: true },
];

const BedAvailability = () => (
  <div className="space-y-6">
    <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Building2 className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Bed Availability</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Hospital Bed Availability</h1>
        <p className="mt-1 text-white/75 text-sm">Real-time hospital bed tracking across your city.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Bed className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">190</p><p className="text-xs text-muted-foreground">Beds Available</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><AlertTriangle className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">16</p><p className="text-xs text-muted-foreground">ICU Available</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Building2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{hospitals.length}</p><p className="text-xs text-muted-foreground">Hospitals Tracked</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Nearby Hospitals</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hospitals.map((h, i) => (
            <div key={i} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{h.name}</h4>
                  <p className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline" /> {h.distance}</p>
                </div>
                {h.emergency && <Badge className="bg-success/10 text-success border-0">24/7 Emergency</Badge>}
              </div>
              <div className="flex gap-4 mb-3">
                <div className="text-center"><p className="text-lg font-bold text-success">{h.available}</p><p className="text-[10px] text-muted-foreground">General</p></div>
                <div className="text-center"><p className={`text-lg font-bold ${h.icu > 0 ? 'text-primary' : 'text-destructive'}`}>{h.icu}</p><p className="text-[10px] text-muted-foreground">ICU</p></div>
                <div className="text-center"><p className="text-lg font-bold text-muted-foreground">{h.totalBeds}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1"><Phone className="h-3 w-3 mr-1" /> Call</Button>
                <Button size="sm" className="flex-1">Book Bed</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BedAvailability;
