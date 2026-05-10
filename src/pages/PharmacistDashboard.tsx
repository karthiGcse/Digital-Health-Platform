import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pill, Package, AlertTriangle, Clock, Bell, ArrowRight,
  TrendingUp, CheckCircle2, FileText, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useHospitalDB, HospitalOrderDB, HospitalPatientDB } from '@/hooks/useHospitalDB';

interface LowStockItem { name: string; stock: number; threshold: number; }

const PharmacistDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { getOrdersByType } = useHospitalDB();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState<HospitalOrderDB[]>([]);
  const [todayOrders, setTodayOrders] = useState<HospitalOrderDB[]>([]);
  const [patients, setPatients] = useState<Record<string, HospitalPatientDB>>({});
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel('pharmacist-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_orders' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pharmacy_inventory' }, () => loadInventory())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadData = async () => {
    try {
      const active = await getOrdersByType('pharmacy');
      setOrders(active);

      const today = new Date().toISOString().split('T')[0];
      const { data: all } = await supabase
        .from('hospital_orders')
        .select('*')
        .eq('order_type', 'pharmacy')
        .gte('created_at', today)
        .order('created_at', { ascending: false });
      if (all) setTodayOrders(all as HospitalOrderDB[]);

      const ids = [...new Set(active.map(o => o.patient_id))];
      if (ids.length > 0) {
        const { data: pats } = await supabase.from('hospital_patients').select('*').in('id', ids);
        if (pats) {
          const map: Record<string, HospitalPatientDB> = {};
          pats.forEach((p: any) => { map[p.id] = p; });
          setPatients(map);
        }
      }
      await loadInventory();
    } catch (e) { console.error(e); }
  };

  const loadInventory = async () => {
    const { data } = await supabase
      .from('pharmacy_inventory')
      .select('medicine_name, stock_quantity')
      .lte('stock_quantity', 20)
      .order('stock_quantity')
      .limit(5);
    if (data) {
      setLowStock(data.map((i: any) => ({ name: i.medicine_name, stock: i.stock_quantity, threshold: 20 })));
    }
  };

  const pending = orders.filter(o => o.status === 'pending').length;
  const ready = orders.filter(o => o.status === 'in_progress' || o.status === 'seen').length;
  const dispensed = todayOrders.filter(o => o.status === 'completed').length;

  const statCards = [
    { label: 'Pending Rx', value: pending, icon: FileText, gradient: 'from-blue-500 to-cyan-500', trend: pending > 0 ? 'Awaiting prep' : 'All clear' },
    { label: 'Ready for Pickup', value: ready, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', trend: 'In progress' },
    { label: 'Low Stock Alerts', value: lowStock.length, icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500', trend: lowStock.length ? 'Action needed' : 'Stocked up' },
    { label: 'Today Dispensed', value: dispensed, icon: Package, gradient: 'from-violet-500 to-purple-500', trend: 'Completed today' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #4c1d95 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome, {profile?.name || 'Pharmacist'} 💊
                </h1>
                <p className="text-white/50 text-sm">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {' • '}
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20" onClick={() => navigate('/smart-pharmacy')}>
              <Package className="h-4 w-4 mr-2" /> Pharmacy
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-violet-500 text-white" onClick={() => navigate('/inventory')}>
              <Search className="h-4 w-4 mr-2" /> Inventory
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:shadow-lg transition-all border-border/50 bg-card/90 backdrop-blur-sm">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-[10px] text-emerald-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prescription Queue */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" /> Prescription Queue
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate('/smart-pharmacy')}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No pending prescriptions. New orders from doctors will appear here automatically.
                  </div>
                ) : (
                  orders.slice(0, 8).map((o) => {
                    const p = patients[o.patient_id];
                    const meds = Array.isArray(o.medicines) ? o.medicines.length : 0;
                    const time = new Date(o.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const statusLabel = o.status === 'pending' ? 'New' : o.status === 'seen' ? 'Acknowledged' : 'Preparing';
                    return (
                      <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => navigate('/smart-pharmacy')}>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                            {(p?.name || 'P').charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{p?.name || 'Patient'}</p>
                            <p className="text-xs text-muted-foreground">{p?.health_id || '—'} • {meds} medicine{meds === 1 ? '' : 's'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{time}</span>
                          <Badge className={statusLabel === 'New' ? 'bg-amber-500/15 text-amber-600 border-amber-500/20' : 'bg-blue-500/15 text-blue-600 border-blue-500/20'}>
                            {statusLabel}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock + Quick Actions */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStock.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">All medicines well-stocked.</p>
                ) : lowStock.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-2 w-2 rounded-full mt-1.5 shrink-0 bg-red-500" />
                    <div>
                      <p className="text-xs text-foreground font-medium">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Stock: {item.stock} / Min: {item.threshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: 'Pharmacy', icon: Pill, route: '/smart-pharmacy', color: 'from-purple-500 to-violet-500' },
                { label: 'Inventory', icon: Package, route: '/inventory', color: 'from-emerald-500 to-teal-500' },
                { label: 'Notifications', icon: Bell, route: '/patient-notifications', color: 'from-amber-500 to-orange-500' },
                { label: 'Interactions', icon: AlertTriangle, route: '/interactions', color: 'from-red-500 to-rose-500' },
              ].map((a) => (
                <Button key={a.label} variant="outline" className="h-16 flex-col gap-1 hover:shadow-md transition-all" onClick={() => navigate(a.route)}>
                  <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                    <a.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium">{a.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
