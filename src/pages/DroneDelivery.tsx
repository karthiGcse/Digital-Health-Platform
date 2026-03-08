import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Plane, Package, Clock, MapPin, Thermometer, Wind, CheckCircle2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const deliveries = [
  { id: 'DRN-001', medicine: 'Insulin Vials (2x)', status: 'In Flight', progress: 65, eta: '12 min', temp: '4°C', distance: '3.2 km', drone: 'MedDrone-X1' },
  { id: 'DRN-002', medicine: 'Epinephrine Auto-Injector', status: 'Preparing', progress: 15, eta: '28 min', temp: '22°C', distance: '5.8 km', drone: 'MedDrone-X3' },
  { id: 'DRN-003', medicine: 'Antibiotics Pack', status: 'Delivered', progress: 100, eta: 'Delivered', temp: '22°C', distance: '2.1 km', drone: 'MedDrone-X2' },
];

const availableMeds = [
  { name: 'Insulin (Rapid-Acting)', price: 850, delivery: '15-20 min', temp: 'Cold Chain' },
  { name: 'Epinephrine Pen', price: 1200, delivery: '10-15 min', temp: 'Standard' },
  { name: 'Salbutamol Inhaler', price: 320, delivery: '15-20 min', temp: 'Standard' },
  { name: 'Nitroglycerin Tablets', price: 450, delivery: '10-15 min', temp: 'Standard' },
  { name: 'Anti-venom Kit', price: 3500, delivery: '20-30 min', temp: 'Cold Chain' },
];

const statusColors: Record<string, string> = {
  'In Flight': 'bg-info/10 text-info',
  'Preparing': 'bg-warning/10 text-warning',
  'Delivered': 'bg-success/10 text-success',
};

const DroneDelivery = () => {
  const [activeDelivery, setActiveDelivery] = useState(deliveries[0]);
  const [progress, setProgress] = useState(activeDelivery.progress);

  useEffect(() => {
    if (activeDelivery.status === 'In Flight') {
      const timer = setInterval(() => setProgress(p => Math.min(p + 1, 95)), 2000);
      return () => clearInterval(timer);
    }
  }, [activeDelivery]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-cyan-600 to-sky-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Drone Medicine Delivery</h1>
          </div>
          <p className="text-white/80 text-sm">Emergency medicine delivery via autonomous drones. 30-minute guarantee.</p>
        </div>
        <Plane className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Active Deliveries */}
      <h3 className="font-heading font-semibold text-sm">Active Deliveries</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {deliveries.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`rounded-card cursor-pointer transition-all ${activeDelivery.id === d.id ? 'ring-2 ring-primary' : ''}`} onClick={() => { setActiveDelivery(d); setProgress(d.progress); }}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge className={`text-[10px] border-0 ${statusColors[d.status]}`}>{d.status}</Badge>
                  <span className="text-xs text-muted-foreground">{d.id}</span>
                </div>
                <p className="font-medium text-sm">{d.medicine}</p>
                <Progress value={d.id === activeDelivery.id && d.status === 'In Flight' ? progress : d.progress} className="h-1.5" />
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.eta}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.distance}</span>
                  <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {d.temp}</span>
                  <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {d.drone}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Tracker */}
      {activeDelivery.status === 'In Flight' && (
        <Card className="rounded-card border-info/30 bg-info/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="h-4 w-4 text-info animate-pulse" />
              <h4 className="font-medium text-sm">Live Tracking — {activeDelivery.id}</h4>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-info to-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
              <div className="absolute top-1/2 -translate-y-1/2 text-lg" style={{ left: `${progress - 3}%` }}>🚁</div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>📦 Pharmacy</span>
              <span>ETA: {Math.max(1, Math.round((100 - progress) * 0.3))} min</span>
              <span>🏠 Your Location</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order New */}
      <h3 className="font-heading font-semibold text-sm">Emergency Medicines Available</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {availableMeds.map((m, i) => (
          <motion.div key={m.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.delivery}</span>
                    <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {m.temp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">₹{m.price}</p>
                  <Button size="sm" className="mt-1 text-xs h-7" onClick={() => toast.success(`Drone dispatched for ${m.name}!`)}>
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DroneDelivery;
