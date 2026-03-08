import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Package, Calendar, Clock, DollarSign, Pill, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  nextRefill: string;
  price: number;
  active: boolean;
  daysLeft: number;
  savings: number;
}

const initialSubscriptions: Subscription[] = [
  { id: '1', medicine: 'Metformin 500mg', dosage: '2 tablets/day', frequency: 'Monthly', nextRefill: '2026-03-15', price: 245, active: true, daysLeft: 7, savings: 35 },
  { id: '2', medicine: 'Amlodipine 5mg', dosage: '1 tablet/day', frequency: 'Monthly', nextRefill: '2026-03-20', price: 180, active: true, daysLeft: 12, savings: 25 },
  { id: '3', medicine: 'Atorvastatin 10mg', dosage: '1 tablet/night', frequency: 'Every 2 months', nextRefill: '2026-04-01', price: 320, active: true, daysLeft: 24, savings: 48 },
  { id: '4', medicine: 'Pantoprazole 40mg', dosage: '1 tablet/morning', frequency: 'Monthly', nextRefill: '2026-03-10', price: 150, active: false, daysLeft: 2, savings: 20 },
];

const pharmacies = [
  { name: 'MedPlus', price: 245, rating: 4.5, delivery: 'Free' },
  { name: 'Apollo Pharmacy', price: 260, rating: 4.7, delivery: '₹30' },
  { name: 'Netmeds', price: 228, rating: 4.3, delivery: 'Free above ₹500' },
];

const AutoRefill = () => {
  const [subs, setSubs] = useState(initialSubscriptions);
  const [showCompare, setShowCompare] = useState(false);

  const toggleSub = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    const sub = subs.find(s => s.id === id);
    toast.success(sub?.active ? `Paused ${sub.medicine} refill` : `Resumed ${sub?.medicine} refill`);
  };

  const activeSubs = subs.filter(s => s.active);
  const totalMonthly = activeSubs.reduce((s, sub) => s + sub.price, 0);
  const totalSavings = activeSubs.reduce((s, sub) => s + sub.savings, 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-emerald-600 to-green-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Auto Refill & Subscription</h1>
          </div>
          <p className="text-white/80 text-sm">Never miss a refill. Automatic medication delivery on schedule.</p>
        </div>
        <RefreshCw className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Refills', value: activeSubs.length, icon: RefreshCw, color: 'text-primary' },
          { label: 'Monthly Cost', value: `₹${totalMonthly}`, icon: DollarSign, color: 'text-warning' },
          { label: 'Monthly Savings', value: `₹${totalSavings}`, icon: Package, color: 'text-success' },
          { label: 'Next Refill', value: subs.reduce((min, s) => s.active && s.daysLeft < min ? s.daysLeft : min, 99) + 'd', icon: Calendar, color: 'text-info' },
        ].map((s) => (
          <Card key={s.label} className="rounded-card">
            <CardContent className="p-4 text-center">
              <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriptions */}
      <div className="space-y-3">
        {subs.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`rounded-card ${!s.active ? 'opacity-60' : ''} ${s.daysLeft <= 3 && s.active ? 'border-warning/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10"><Pill className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{s.medicine}</h4>
                      {s.daysLeft <= 3 && s.active && <Badge className="bg-warning/10 text-warning border-0 text-[10px] gap-1"><AlertCircle className="h-3 w-3" /> Refill Soon</Badge>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{s.dosage}</span>
                      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {s.frequency}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Next: {s.nextRefill}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-primary">₹{s.price}</span>
                      <span className="text-xs text-success">Save ₹{s.savings}</span>
                    </div>
                  </div>
                  <Switch checked={s.active} onCheckedChange={() => toggleSub(s.id)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pharmacy Comparison */}
      <Button variant="outline" className="w-full text-xs gap-2" onClick={() => setShowCompare(!showCompare)}>
        <DollarSign className="h-4 w-4" /> {showCompare ? 'Hide' : 'Compare'} Pharmacy Prices
      </Button>

      {showCompare && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div className="grid sm:grid-cols-3 gap-3">
            {pharmacies.map((p, i) => (
              <Card key={p.name} className={`rounded-card ${i === 2 ? 'border-success/30 bg-success/5' : ''}`}>
                <CardContent className="p-4 text-center space-y-2">
                  {i === 2 && <Badge className="bg-success/10 text-success border-0 text-[10px]">Best Price</Badge>}
                  <h4 className="font-medium text-sm">{p.name}</h4>
                  <p className="text-lg font-bold text-primary">₹{p.price}</p>
                  <p className="text-xs text-muted-foreground">⭐ {p.rating} • Delivery: {p.delivery}</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => toast.success(`Switched to ${p.name}`)}>Select</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <Button className="w-full gap-2" onClick={() => toast.info('Add medicine subscription form coming soon')}>
        <Plus className="h-4 w-4" /> Add New Subscription
      </Button>
    </div>
  );
};

export default AutoRefill;
