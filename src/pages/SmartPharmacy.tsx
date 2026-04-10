import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Pill, Search, Package, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Bell, Users, Stethoscope, RefreshCw, Eye, Hash
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useHospitalDB, HospitalOrderDB, HospitalPatientDB } from '@/hooks/useHospitalDB';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SmartPharmacy = () => {
  const navigate = useNavigate();
  const { getOrdersByType, updateOrderStatus, addNotificationLog } = useHospitalDB();
  const [orders, setOrders] = useState<HospitalOrderDB[]>([]);
  const [patients, setPatients] = useState<Record<string, HospitalPatientDB>>({});
  const [allOrders, setAllOrders] = useState<HospitalOrderDB[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
    // Realtime for orders
    const channel = supabase
      .channel('pharmacy-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_orders' }, () => {
        loadOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadOrders = async () => {
    try {
      const pharmacyOrders = await getOrdersByType('pharmacy');
      setOrders(pharmacyOrders);

      // Also load all orders for history
      const { data: all } = await supabase
        .from('hospital_orders')
        .select('*')
        .eq('order_type', 'pharmacy')
        .order('created_at', { ascending: false })
        .limit(50);
      if (all) setAllOrders(all as HospitalOrderDB[]);

      // Load patient details
      const patientIds = [...new Set(pharmacyOrders.map(o => o.patient_id))];
      if (patientIds.length > 0) {
        const { data } = await supabase
          .from('hospital_patients')
          .select('*')
          .in('id', patientIds);
        if (data) {
          const map: Record<string, HospitalPatientDB> = {};
          data.forEach((p: any) => { map[p.id] = p; });
          setPatients(map);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateStatus = async (order: HospitalOrderDB, newStatus: string) => {
    try {
      await updateOrderStatus(order.id, newStatus);

      if (newStatus === 'seen') {
        // Blue tick — doctor knows pharmacy has seen it
        toast({ title: '✅ Seen', description: `Prescription acknowledged. Doctor notified.` });
      }
      if (newStatus === 'in_progress') {
        await addNotificationLog({
          token_id: order.token_id,
          patient_id: order.patient_id,
          stage: 'pharmacy_preparing',
          message: 'Your medicine is being prepared. Please wait.',
        });
        toast({ title: '🔄 Preparing', description: 'Patient notified: Medicine being prepared.' });
      }
      if (newStatus === 'completed') {
        await addNotificationLog({
          token_id: order.token_id,
          patient_id: order.patient_id,
          stage: 'pharmacy_ready',
          message: 'Your medicines are ready for pickup at Pharmacy Counter.',
        });
        toast({ title: '✅ Ready for Pickup', description: 'Patient notified: Medicines ready!' });
      }
      loadOrders();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'seen');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Pharmacy</h1>
            <p className="text-sm text-muted-foreground">Auto-loaded prescriptions • Zero manual entry</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
            <Stethoscope className="h-4 w-4 mr-1" /> Doctor Queue
          </Button>
          <Button size="sm" variant="outline" onClick={loadOrders}>
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Orders', value: pendingOrders.length, icon: Package, color: 'from-blue-500 to-cyan-500' },
          { label: 'Preparing', value: preparingOrders.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Completed Today', value: allOrders.filter(o => o.status === 'completed').length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
          { label: 'Total Today', value: allOrders.length, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">📥 New ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="preparing">🔄 Preparing ({preparingOrders.length})</TabsTrigger>
          <TabsTrigger value="all">📋 All Orders ({allOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Pill className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No new prescriptions. They appear automatically when doctors send them.</p>
              </Card>
            ) : (
              pendingOrders.map(order => {
                const patient = patients[order.patient_id];
                const meds = (order.medicines as any[]) || [];
                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            Rx
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold">{patient?.name || 'Loading...'}</p>
                              <Badge variant="outline" className="text-[10px]">{patient?.health_id}</Badge>
                              <Badge className="bg-blue-500/15 text-blue-600 text-[10px]">New</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Dx: {order.order_details}</p>
                            <div className="mt-2 space-y-1">
                              {meds.map((m: any, i: number) => (
                                <div key={i} className="text-xs p-1.5 rounded bg-muted/50">
                                  <span className="font-medium">{i + 1}. {m.name}</span> — {m.dosage} — {m.timing} — {m.duration}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => handleUpdateStatus(order, 'seen')}>
                            <Eye className="h-3 w-3 mr-1" /> Seen ✓
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order, 'in_progress')}>
                            Start Preparing
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="preparing">
          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders being prepared.</p>
            ) : (
              preparingOrders.map(order => {
                const patient = patients[order.patient_id];
                const meds = (order.medicines as any[]) || [];
                return (
                  <Card key={order.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">{patient?.name || 'Loading...'} — {patient?.health_id}</p>
                          <p className="text-xs text-muted-foreground">{meds.map((m: any) => m.name).join(', ')}</p>
                          <div className="mt-2">
                            <p className="text-[10px] text-muted-foreground mb-1">Preparation status</p>
                            <Progress value={order.status === 'seen' ? 30 : 70} className="h-2 w-48" />
                          </div>
                        </div>
                        <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleUpdateStatus(order, 'completed')}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Ready for Pickup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-2">
            {allOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet.</p>
            ) : (
              allOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold">{patients[order.patient_id]?.name || 'Patient'}</p>
                    <p className="text-xs text-muted-foreground">
                      {((order.medicines as any[]) || []).map((m: any) => m.name).join(', ')}
                    </p>
                  </div>
                  <Badge className={`text-[10px] ${
                    order.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                    order.status === 'in_progress' ? 'bg-amber-500/15 text-amber-600' :
                    order.status === 'seen' ? 'bg-cyan-500/15 text-cyan-600' :
                    'bg-blue-500/15 text-blue-600'
                  }`}>{order.status}</Badge>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartPharmacy;
