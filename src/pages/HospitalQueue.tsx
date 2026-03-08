import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Clock, Users, Search, Calendar, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const hospitals = [
  { id: 1, name: 'City General Hospital', departments: [
    { name: 'General OPD', wait: 25, queue: 12, capacity: 40 },
    { name: 'Cardiology', wait: 45, queue: 8, capacity: 15 },
    { name: 'Orthopedics', wait: 30, queue: 6, capacity: 20 },
    { name: 'Dermatology', wait: 15, queue: 3, capacity: 25 },
  ], distance: '2.3 km' },
  { id: 2, name: 'Apollo Medical Center', departments: [
    { name: 'General OPD', wait: 15, queue: 5, capacity: 50 },
    { name: 'Pediatrics', wait: 20, queue: 7, capacity: 20 },
    { name: 'ENT', wait: 10, queue: 2, capacity: 15 },
    { name: 'Neurology', wait: 55, queue: 10, capacity: 12 },
  ], distance: '4.1 km' },
  { id: 3, name: 'Max Healthcare', departments: [
    { name: 'General OPD', wait: 35, queue: 15, capacity: 35 },
    { name: 'Gynecology', wait: 40, queue: 9, capacity: 18 },
    { name: 'Ophthalmology', wait: 20, queue: 4, capacity: 22 },
    { name: 'Cardiology', wait: 50, queue: 11, capacity: 14 },
  ], distance: '5.7 km' },
];

const myBookings = [
  { hospital: 'City General Hospital', dept: 'Cardiology', date: '2026-03-09', time: '10:30 AM', position: 3, status: 'Confirmed' },
  { hospital: 'Apollo Medical Center', dept: 'ENT', date: '2026-03-12', time: '2:00 PM', position: null, status: 'Upcoming' },
];

const HospitalQueue = () => {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [counters, setCounters] = useState<Record<string, number>>({});

  // Simulate live queue updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => {
        const updated = { ...prev };
        const key = `${selectedHospital.id}-${Math.floor(Math.random() * selectedHospital.departments.length)}`;
        updated[key] = (updated[key] || 0) + 1;
        return updated;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedHospital]);

  const getWaitColor = (wait: number) => wait < 20 ? 'text-success' : wait < 40 ? 'text-warning' : 'text-destructive';

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-teal-600 to-emerald-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Hospital Queue Management</h1>
          </div>
          <p className="text-white/80 text-sm">Real-time hospital queue tracking and smart slot booking.</p>
        </div>
        <Building2 className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* My Bookings */}
      {myBookings.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-sm">My Queue Positions</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {myBookings.map((b, i) => (
              <Card key={i} className="rounded-card border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{b.hospital}</p>
                      <p className="text-xs text-muted-foreground">{b.dept} • {b.date} at {b.time}</p>
                    </div>
                    <Badge className="bg-success/10 text-success border-0 text-xs">{b.status}</Badge>
                  </div>
                  {b.position && (
                    <div className="mt-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-primary">Position #{b.position}</span>
                      <span className="text-xs text-muted-foreground">in queue</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hospital Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {hospitals.map(h => (
          <Button key={h.id} size="sm" variant={selectedHospital.id === h.id ? 'default' : 'outline'} onClick={() => setSelectedHospital(h)} className="shrink-0 text-xs gap-1">
            <MapPin className="h-3 w-3" /> {h.name} ({h.distance})
          </Button>
        ))}
      </div>

      {/* Department Queues */}
      <div className="grid sm:grid-cols-2 gap-4">
        {selectedHospital.departments.map((d, i) => {
          const load = (d.queue / d.capacity) * 100;
          return (
            <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="rounded-card">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">{d.name}</h4>
                    <Badge variant="outline" className={`text-xs ${getWaitColor(d.wait)}`}>
                      <Clock className="h-3 w-3 mr-1" /> ~{d.wait} min
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {d.queue} in queue</span>
                    <span>Capacity: {d.capacity}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Queue Load</span>
                      <span className={load > 75 ? 'text-destructive' : load > 50 ? 'text-warning' : 'text-success'}>{Math.round(load)}%</span>
                    </div>
                    <Progress value={load} className={`h-2 ${load > 75 ? '[&>div]:bg-destructive' : load > 50 ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`} />
                  </div>
                  <Button size="sm" className="w-full text-xs" onClick={() => toast.success(`Slot booked at ${selectedHospital.name} — ${d.name}`)}>
                    <Calendar className="h-3 w-3 mr-1" /> Book Slot
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalQueue;
