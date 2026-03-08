import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RefreshCw, Package, Calendar, DollarSign, Pill, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('Monthly');
  const [newPrice, setNewPrice] = useState('');
  const { user } = useAuth();

  const toggleSub = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    const sub = subs.find(s => s.id === id);
    toast.success(sub?.active ? `Paused ${sub.medicine} refill` : `Resumed ${sub?.medicine} refill`);
  };

  const deleteSub = (id: string) => {
    const sub = subs.find(s => s.id === id);
    setSubs(prev => prev.filter(s => s.id !== id));
    toast.success(`Removed ${sub?.medicine} subscription`);
  };

  const handleAddSubscription = async () => {
    if (!newMedicine.trim() || !newDosage.trim() || !newPrice) return;

    const price = Number(newPrice);
    const savings = Math.round(price * 0.15);
    const freqDays = newFrequency === 'Monthly' ? 30 : newFrequency === 'Every 2 months' ? 60 : newFrequency === 'Weekly' ? 7 : 90;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + freqDays);

    const newSub: Subscription = {
      id: Date.now().toString(),
      medicine: newMedicine.trim(),
      dosage: newDosage.trim(),
      frequency: newFrequency,
      nextRefill: nextDate.toISOString().split('T')[0],
      price,
      active: true,
      daysLeft: freqDays,
      savings,
    };

    setSubs(prev => [newSub, ...prev]);
    toast.success(`${newMedicine} subscription activated!`);

    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '💊 New Auto-Refill Subscription',
        message: `"${newMedicine}" (${newDosage}) has been added. Next refill: ${nextDate.toLocaleDateString()}.`,
        type: 'success',
        link: '/auto-refill',
      });
    }

    setNewMedicine('');
    setNewDosage('');
    setNewFrequency('Monthly');
    setNewPrice('');
    setShowAddForm(false);
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
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{s.dosage}</span>
                      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {s.frequency}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Next: {s.nextRefill}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-primary">₹{s.price}</span>
                      <span className="text-xs text-success">Save ₹{s.savings}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteSub(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Switch checked={s.active} onCheckedChange={() => toggleSub(s.id)} />
                  </div>
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

      <Button className="w-full gap-2" onClick={() => setShowAddForm(true)}>
        <Plus className="h-4 w-4" /> Add New Subscription
      </Button>

      {/* Add Subscription Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-primary" />Add New Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Medicine Name</Label>
              <Input placeholder="e.g. Aspirin 75mg" value={newMedicine} onChange={e => setNewMedicine(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input placeholder="e.g. 1 tablet/day" value={newDosage} onChange={e => setNewDosage(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Refill Frequency</Label>
              <Select value={newFrequency} onValueChange={setNewFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Every 2 months">Every 2 months</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" placeholder="e.g. 250" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
            </div>
            {newPrice && Number(newPrice) > 0 && (
              <div className="p-3 rounded-xl bg-success/10 text-center">
                <p className="text-xs text-muted-foreground">Estimated Savings</p>
                <p className="text-lg font-heading font-bold text-success">₹{Math.round(Number(newPrice) * 0.15)}/refill</p>
                <p className="text-[10px] text-muted-foreground">15% auto-refill discount applied</p>
              </div>
            )}
            <Button
              className="w-full"
              onClick={handleAddSubscription}
              disabled={!newMedicine.trim() || !newDosage.trim() || !newPrice || Number(newPrice) <= 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Activate Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutoRefill;
