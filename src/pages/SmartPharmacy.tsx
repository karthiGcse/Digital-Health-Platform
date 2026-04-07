import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Pill, Search, Package, AlertTriangle, CheckCircle2, Clock, TrendingUp, Bell, Users, Stethoscope } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useHospital } from '@/contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';

interface StockItem {
  name: string;
  stock: number;
  maxStock: number;
  expiry: string;
  price: number;
}

const mockStock: StockItem[] = [
  { name: 'Paracetamol 500mg', stock: 450, maxStock: 500, expiry: '2026-06', price: 5 },
  { name: 'Amoxicillin 250mg', stock: 120, maxStock: 300, expiry: '2025-09', price: 12 },
  { name: 'Metformin 500mg', stock: 280, maxStock: 400, expiry: '2026-03', price: 8 },
  { name: 'Amlodipine 5mg', stock: 35, maxStock: 200, expiry: '2025-12', price: 15 },
  { name: 'Omeprazole 20mg', stock: 200, maxStock: 300, expiry: '2026-01', price: 10 },
  { name: 'Azithromycin 500mg', stock: 15, maxStock: 150, expiry: '2025-08', price: 25 },
  { name: 'Ibuprofen 400mg', stock: 320, maxStock: 400, expiry: '2026-05', price: 6 },
  { name: 'Cetirizine 10mg', stock: 180, maxStock: 250, expiry: '2026-04', price: 4 },
  { name: 'Atorvastatin 10mg', stock: 90, maxStock: 200, expiry: '2025-11', price: 18 },
  { name: 'Losartan 50mg', stock: 8, maxStock: 150, expiry: '2025-10', price: 20 },
  { name: 'Dolo 650mg', stock: 500, maxStock: 500, expiry: '2026-08', price: 3 },
  { name: 'Salbutamol Inhaler', stock: 25, maxStock: 50, expiry: '2025-12', price: 120 },
  { name: 'Montelukast 10mg', stock: 150, maxStock: 200, expiry: '2026-02', price: 14 },
  { name: 'Pantoprazole 40mg', stock: 220, maxStock: 300, expiry: '2026-06', price: 9 },
  { name: 'Crocin 500mg', stock: 380, maxStock: 500, expiry: '2026-07', price: 4 },
];

const topMedicines = [
  { name: 'Paracetamol', count: 85 }, { name: 'Metformin', count: 62 }, { name: 'Amoxicillin', count: 48 },
  { name: 'Dolo 650', count: 45 }, { name: 'Cetirizine', count: 38 }, { name: 'Omeprazole', count: 35 },
  { name: 'Amlodipine', count: 30 }, { name: 'Ibuprofen', count: 28 }, { name: 'Azithromycin', count: 22 },
  { name: 'Atorvastatin', count: 18 },
];

const SmartPharmacy = () => {
  const { prescriptions, updatePrescriptionStatus, patients } = useHospital();
  const navigate = useNavigate();
  const [stock, setStock] = useState(mockStock);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateStatus = (id: string, status: 'In Progress' | 'Ready' | 'Dispensed') => {
    updatePrescriptionStatus(id, status);
    toast({
      title: `${status === 'Ready' ? '✅ Ready for pickup' : status === 'In Progress' ? '🔄 Preparing...' : '💊 Dispensed'}`,
      description: `Prescription ${id} updated. Patient notified.`,
    });
  };

  const getStockLevel = (item: StockItem) => {
    const pct = (item.stock / item.maxStock) * 100;
    if (pct < 15) return { color: 'text-red-600 bg-red-500/10', label: 'Critical' };
    if (pct < 40) return { color: 'text-amber-600 bg-amber-500/10', label: 'Low' };
    return { color: 'text-emerald-600 bg-emerald-500/10', label: 'Good' };
  };

  const isExpiringSoon = (expiry: string) => {
    const exp = new Date(expiry);
    const months = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
    return months < 4;
  };

  const filteredStock = stock.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const lowStockItems = stock.filter(s => (s.stock / s.maxStock) < 0.15);
  const totalValue = stock.reduce((sum, s) => sum + s.stock * s.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Pharmacy</h1>
            <p className="text-sm text-muted-foreground">Prescriptions from doctors, stock & analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
            <Stethoscope className="h-4 w-4 mr-1" /> Doctor Queue
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/patient-notifications')}>
            <Bell className="h-4 w-4 mr-1" /> Notifications
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">📥 Inbox ({prescriptions.filter(p => p.status === 'New').length})</TabsTrigger>
          <TabsTrigger value="all">📋 All Rx ({prescriptions.length})</TabsTrigger>
          <TabsTrigger value="stock">📦 Stock</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="space-y-3">
            {prescriptions.filter(rx => rx.status !== 'Dispensed').length === 0 ? (
              <Card className="p-12 text-center">
                <Pill className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No prescriptions yet. They will appear here when doctors send them.</p>
              </Card>
            ) : (
              prescriptions.filter(rx => rx.status !== 'Dispensed').map(rx => (
                <Card key={rx.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          Rx
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold">{rx.id}</p>
                            <Badge className={
                              rx.status === 'New' ? 'bg-blue-500/15 text-blue-600' :
                              rx.status === 'In Progress' ? 'bg-amber-500/15 text-amber-600' :
                              rx.status === 'Ready' ? 'bg-emerald-500/15 text-emerald-600' :
                              'bg-muted text-muted-foreground'
                            }>{rx.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{rx.patientName} ({rx.patientId})</p>
                          <p className="text-xs text-muted-foreground">Dx: {rx.diagnosis}</p>
                          <p className="text-xs text-muted-foreground">{rx.medicines.map(m => m.name).join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{rx.time}</span>
                        {rx.status === 'New' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(rx.id, 'In Progress')}>Start Preparing</Button>
                        )}
                        {rx.status === 'In Progress' && (
                          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleUpdateStatus(rx.id, 'Ready')}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Ready
                          </Button>
                        )}
                        {rx.status === 'Ready' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(rx.id, 'Dispensed')}>Dispensed</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No prescriptions yet.</p>
            ) : (
              prescriptions.map(rx => (
                <div key={rx.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold">{rx.id} — {rx.patientName}</p>
                    <p className="text-xs text-muted-foreground">{rx.medicines.map(m => m.name).join(', ')}</p>
                  </div>
                  <Badge className={
                    rx.status === 'Dispensed' ? 'bg-muted text-muted-foreground' :
                    rx.status === 'Ready' ? 'bg-emerald-500/15 text-emerald-600' :
                    rx.status === 'In Progress' ? 'bg-amber-500/15 text-amber-600' :
                    'bg-blue-500/15 text-blue-600'
                  }>{rx.status}</Badge>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="stock">
          <div className="space-y-4">
            {lowStockItems.length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" /> {lowStockItems.length} items critically low: {lowStockItems.map(i => i.name).join(', ')}
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search medicines..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid gap-2">
              {filteredStock.map(item => {
                const level = getStockLevel(item);
                const expiring = isExpiringSoon(item.expiry);
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Pill className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <Badge className={`text-[10px] ${level.color}`}>{level.label} ({item.stock}/{item.maxStock})</Badge>
                          {expiring && <Badge className="text-[10px] bg-amber-500/10 text-amber-600">⚠️ Exp: {item.expiry}</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">₹{item.price}</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Update</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Top 10 Prescribed Medicines</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topMedicines} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">₹{totalValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{prescriptions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Prescriptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
                  <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartPharmacy;
