import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Syringe, Eye, CheckCircle2, Clock, RefreshCw, Stethoscope, Package
} from 'lucide-react';
import { useHospitalDB, HospitalOrderDB, HospitalPatientDB } from '@/hooks/useHospitalDB';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const InjectionCentre = () => {
  const navigate = useNavigate();
  const { getOrdersByType, updateOrderStatus, addNotificationLog } = useHospitalDB();
  const [orders, setOrders] = useState<HospitalOrderDB[]>([]);
  const [patients, setPatients] = useState<Record<string, HospitalPatientDB>>({});
  const [allOrders, setAllOrders] = useState<HospitalOrderDB[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOrders();
    const channel = supabase
      .channel('injection-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_orders' }, () => loadOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadOrders = async () => {
    try {
      const injOrders = await getOrdersByType('injection');
      setOrders(injOrders);

      const { data: all } = await supabase
        .from('hospital_orders')
        .select('*')
        .eq('order_type', 'injection')
        .order('created_at', { ascending: false })
        .limit(50);
      if (all) setAllOrders(all as HospitalOrderDB[]);

      const patientIds = [...new Set(injOrders.map(o => o.patient_id))];
      if (patientIds.length > 0) {
        const { data } = await supabase.from('hospital_patients').select('*').in('id', patientIds);
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
      if (newStatus === 'completed') {
        await supabase.from('hospital_orders').update({
          result_notes: notes[order.id] || 'Injection administered',
          status: 'completed',
          completed_at: new Date().toISOString(),
        }).eq('id', order.id);
        await addNotificationLog({
          token_id: order.token_id,
          patient_id: order.patient_id,
          stage: 'injection_done',
          message: 'Your injection has been administered. Please rest for 15 minutes.',
        });
        toast({ title: '✅ Injection Done', description: 'Patient notified to rest.' });
      } else {
        await updateOrderStatus(order.id, newStatus);
        if (newStatus === 'in_progress') {
          await addNotificationLog({
            token_id: order.token_id,
            patient_id: order.patient_id,
            stage: 'injection_preparing',
            message: 'Injection is being prepared. Please wait.',
          });
          toast({ title: '💉 Preparing Injection', description: 'Patient notified.' });
        }
        if (newStatus === 'seen') {
          toast({ title: '✅ Acknowledged' });
        }
      }
      loadOrders();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'seen');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <Syringe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Injection Centre</h1>
            <p className="text-sm text-muted-foreground">Auto-loaded from Doctor — Zero paperwork</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: pendingOrders.length, icon: Package, color: 'from-blue-500 to-cyan-500' },
          { label: 'In Progress', value: activeOrders.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Completed', value: allOrders.filter(o => o.status === 'completed').length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
          { label: 'Total', value: allOrders.length, icon: Syringe, color: 'from-rose-500 to-pink-500' },
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

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">📥 Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="active">🔄 Preparing ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="all">📋 All ({allOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Syringe className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No pending injections. Orders appear automatically.</p>
              </Card>
            ) : (
              pendingOrders.map(order => {
                const patient = patients[order.patient_id];
                return (
                  <Card key={order.id} className="border-l-4 border-l-rose-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            💉
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold">{patient?.name || 'Loading...'}</p>
                              <Badge variant="outline" className="text-[10px]">{patient?.health_id}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{order.order_details}</p>
                            {order.injection_details && <p className="text-xs text-muted-foreground">Details: {order.injection_details}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => handleUpdateStatus(order, 'seen')}>
                            <Eye className="h-3 w-3 mr-1" /> Seen ✓
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order, 'in_progress')}>
                            Prepare
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

        <TabsContent value="active">
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No injections being prepared.</p>
            ) : (
              activeOrders.map(order => {
                const patient = patients[order.patient_id];
                return (
                  <Card key={order.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="text-sm font-bold">{patient?.name || 'Patient'} — {patient?.health_id}</p>
                        <p className="text-xs text-muted-foreground">{order.order_details}</p>
                        <Progress value={order.status === 'seen' ? 40 : 75} className="h-2 w-48 mt-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Notes</Label>
                        <Textarea
                          placeholder="Injection notes..."
                          value={notes[order.id] || ''}
                          onChange={e => setNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                          className="min-h-[40px]"
                        />
                      </div>
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleUpdateStatus(order, 'completed')}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Injection Done
                      </Button>
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
              <p className="text-center text-muted-foreground py-8">No injection orders yet.</p>
            ) : (
              allOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold">{patients[order.patient_id]?.name || 'Patient'}</p>
                    <p className="text-xs text-muted-foreground">{order.order_details}</p>
                  </div>
                  <Badge className={`text-[10px] ${
                    order.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                    order.status === 'in_progress' ? 'bg-amber-500/15 text-amber-600' :
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

export default InjectionCentre;
