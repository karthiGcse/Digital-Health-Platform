import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, Search, Clock, MapPin, CheckCircle2, Calendar, Truck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const labTests = [
  { id: 1, name: 'Complete Blood Count (CBC)', price: 299, turnaround: '24 hrs', popular: true, category: 'Blood' },
  { id: 2, name: 'Lipid Profile', price: 499, turnaround: '24 hrs', popular: true, category: 'Blood' },
  { id: 3, name: 'Thyroid Panel (T3, T4, TSH)', price: 799, turnaround: '48 hrs', popular: true, category: 'Hormone' },
  { id: 4, name: 'HbA1c (Diabetes)', price: 399, turnaround: '24 hrs', popular: false, category: 'Blood' },
  { id: 5, name: 'Liver Function Test', price: 599, turnaround: '24 hrs', popular: false, category: 'Blood' },
  { id: 6, name: 'Kidney Function Test', price: 549, turnaround: '24 hrs', popular: false, category: 'Blood' },
  { id: 7, name: 'Vitamin D', price: 699, turnaround: '48 hrs', popular: true, category: 'Vitamin' },
  { id: 8, name: 'Vitamin B12', price: 599, turnaround: '48 hrs', popular: false, category: 'Vitamin' },
  { id: 9, name: 'Iron Studies', price: 449, turnaround: '24 hrs', popular: false, category: 'Blood' },
  { id: 10, name: 'Full Body Checkup', price: 2499, turnaround: '72 hrs', popular: true, category: 'Package' },
];

const bookings = [
  { id: 'LB-001', test: 'Complete Blood Count', date: '2026-03-06', status: 'Report Ready', slot: '9:00 AM' },
  { id: 'LB-002', test: 'Thyroid Panel', date: '2026-03-07', status: 'Sample Collected', slot: '10:30 AM' },
  { id: 'LB-003', test: 'Lipid Profile', date: '2026-03-09', status: 'Scheduled', slot: '8:00 AM' },
];

const statusColors: Record<string, string> = {
  'Report Ready': 'bg-success/10 text-success',
  'Sample Collected': 'bg-info/10 text-info',
  'Scheduled': 'bg-warning/10 text-warning',
};

const HomeLabBooking = () => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(labTests.map(t => t.category))];
  const filtered = labTests.filter(t =>
    (filter === 'All' || t.category === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCart = (id: number) => {
    setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cartTotal = labTests.filter(t => cart.includes(t.id)).reduce((s, t) => s + t.price, 0);

  const handleBook = () => {
    if (cart.length === 0) return;
    toast.success(`Booked ${cart.length} test(s) for ₹${cartTotal}. Sample collection scheduled for tomorrow 9 AM.`);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-amber-500 to-orange-600 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Home Lab Test Booking</h1>
          </div>
          <p className="text-white/80 text-sm">Book lab tests with doorstep sample collection. Digital reports in 24 hours.</p>
        </div>
        <FlaskConical className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      <Tabs defaultValue="book" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-sm">
          <TabsTrigger value="book">Book Tests</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lab tests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(c => (
                <Button key={c} size="sm" variant={filter === c ? 'default' : 'outline'} onClick={() => setFilter(c)} className="shrink-0 text-xs">{c}</Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`rounded-card cursor-pointer transition-all ${cart.includes(t.id) ? 'ring-2 ring-primary bg-primary/5' : ''}`} onClick={() => toggleCart(t.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{t.name}</h4>
                          {t.popular && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Popular</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.turnaround}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Home Collection</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{t.price}</p>
                        {cart.includes(t.id) && <CheckCircle2 className="h-4 w-4 text-primary mt-1 ml-auto" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {cart.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-card border-primary/30 bg-primary/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{cart.length} test(s) selected</p>
                    <p className="text-xs text-muted-foreground">Total: ₹{cartTotal}</p>
                  </div>
                  <Button onClick={handleBook} className="gap-2"><Truck className="h-4 w-4" /> Book Now</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="rounded-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{b.test}</p>
                      <Badge className={`text-[10px] border-0 ${statusColors[b.status]}`}>{b.status}</Badge>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.slot}</span>
                    </div>
                  </div>
                  {b.status === 'Report Ready' && (
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast.info('Downloading report...')}>
                      <FileText className="h-3 w-3" /> View Report
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeLabBooking;
