import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { BedDouble, AlertTriangle, CheckCircle2, Clock, Users, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type BedStatus = 'available' | 'occupied' | 'cleaning' | 'reserved';

interface Bed {
  id: string;
  number: string;
  ward: string;
  status: BedStatus;
  patient?: string;
  doctor?: string;
  admissionDate?: string;
  expectedDischarge?: string;
}

const wards = ['ICU', 'Emergency', 'General Ward', 'Surgery'];
const statusColors: Record<BedStatus, string> = {
  available: 'bg-emerald-500',
  occupied: 'bg-red-500',
  cleaning: 'bg-amber-500',
  reserved: 'bg-blue-500',
};
const statusLabels: Record<BedStatus, string> = {
  available: '🟢 Available',
  occupied: '🔴 Occupied',
  cleaning: '🟡 Cleaning',
  reserved: '🔵 Reserved',
};

const generateBeds = (): Bed[] => {
  const beds: Bed[] = [];
  const patients = ['Rahul S.', 'Priya P.', 'Amit K.', 'Sneha G.', 'Vikram S.', 'Meera J.', 'Ravi T.', 'Anjali D.', 'Suresh M.', 'Kavita R.'];
  const doctors = ['Dr. Arun', 'Dr. Meena', 'Dr. Rajan', 'Dr. Sunita', 'Dr. Pradeep'];
  let idx = 0;
  wards.forEach(ward => {
    const count = ward === 'ICU' ? 6 : ward === 'Emergency' ? 5 : ward === 'Surgery' ? 4 : 8;
    for (let i = 1; i <= count; i++) {
      const statuses: BedStatus[] = ['available', 'occupied', 'occupied', 'cleaning', 'reserved', 'available', 'occupied'];
      const status = statuses[idx % statuses.length];
      beds.push({
        id: `${ward}-${i}`,
        number: `${ward.charAt(0)}${i.toString().padStart(2, '0')}`,
        ward,
        status,
        ...(status === 'occupied' ? {
          patient: patients[idx % patients.length],
          doctor: doctors[idx % doctors.length],
          admissionDate: '2025-04-03',
          expectedDischarge: '2025-04-08',
        } : {}),
      });
      idx++;
    }
  });
  return beds;
};

const occupancyTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  occupancy: 55 + Math.floor(Math.random() * 30),
}));

const weekdayData = [
  { day: 'Mon', weekday: 78, weekend: 0 },
  { day: 'Tue', weekday: 82, weekend: 0 },
  { day: 'Wed', weekday: 85, weekend: 0 },
  { day: 'Thu', weekday: 80, weekend: 0 },
  { day: 'Fri', weekday: 76, weekend: 0 },
  { day: 'Sat', weekday: 0, weekend: 65 },
  { day: 'Sun', weekday: 0, weekend: 60 },
];

const BedManagement = () => {
  const [beds, setBeds] = useState(generateBeds);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedWard, setSelectedWard] = useState('All');

  const total = beds.length;
  const available = beds.filter(b => b.status === 'available').length;
  const occupied = beds.filter(b => b.status === 'occupied').length;
  const cleaning = beds.filter(b => b.status === 'cleaning').length;
  const occupancyRate = Math.round((occupied / total) * 100);
  const icuOccupancy = Math.round((beds.filter(b => b.ward === 'ICU' && b.status === 'occupied').length / beds.filter(b => b.ward === 'ICU').length) * 100);

  const filteredBeds = selectedWard === 'All' ? beds : beds.filter(b => b.ward === selectedWard);

  const updateBedStatus = (bedId: string, newStatus: BedStatus) => {
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus, patient: newStatus === 'available' ? undefined : b.patient } : b));
    setSelectedBed(null);
    toast({ title: 'Bed Updated', description: `Bed status changed to ${newStatus}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <BedDouble className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Bed Management</h1>
          <p className="text-sm text-muted-foreground">Real-time bed status across all wards</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: total, color: 'text-foreground' },
          { label: 'Available', value: available, color: 'text-emerald-600' },
          { label: 'Occupied', value: occupied, color: 'text-red-600' },
          { label: 'Cleaning', value: cleaning, color: 'text-amber-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
        <Card className={occupancyRate > 80 ? 'border-red-500/50' : ''}>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${occupancyRate > 80 ? 'text-red-600' : 'text-blue-600'}`}>{occupancyRate}%</p>
            <p className="text-xs text-muted-foreground">Occupancy</p>
            <Progress value={occupancyRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(occupancyRate > 80 || icuOccupancy > 80) && (
        <div className="space-y-2">
          {occupancyRate > 80 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" /> Hospital occupancy exceeds 80%. Consider discharge planning.
            </div>
          )}
          {icuOccupancy > 80 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4" /> ICU at {icuOccupancy}% capacity.
            </div>
          )}
        </div>
      )}

      <Tabs defaultValue="floor-map">
        <TabsList>
          <TabsTrigger value="floor-map">🏥 Floor Map</TabsTrigger>
          <TabsTrigger value="charts">📊 Charts</TabsTrigger>
          <TabsTrigger value="housekeeping">🧹 Housekeeping</TabsTrigger>
        </TabsList>

        <TabsContent value="floor-map">
          <div className="flex gap-2 mb-4 flex-wrap">
            {['All', ...wards].map(w => (
              <Button key={w} size="sm" variant={selectedWard === w ? 'default' : 'outline'} onClick={() => setSelectedWard(w)}>
                {w}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredBeds.map(bed => (
              <motion.div key={bed.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  className={`cursor-pointer hover:shadow-lg transition-all ${selectedBed?.id === bed.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedBed(bed)}
                >
                  <CardContent className="p-3 text-center">
                    <div className={`h-3 w-3 rounded-full ${statusColors[bed.status]} mx-auto mb-2`} />
                    <p className="text-sm font-bold">{bed.number}</p>
                    <p className="text-[10px] text-muted-foreground">{bed.ward}</p>
                    {bed.patient && <p className="text-[10px] text-foreground mt-1 truncate">{bed.patient}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bed Detail Panel */}
          {selectedBed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold">Bed {selectedBed.number}</h3>
                      <p className="text-sm text-muted-foreground">{selectedBed.ward}</p>
                    </div>
                    <Badge className={`${statusColors[selectedBed.status]} text-white`}>{statusLabels[selectedBed.status]}</Badge>
                  </div>
                  {selectedBed.patient && (
                    <div className="space-y-1 mb-3 text-sm">
                      <p>Patient: <strong>{selectedBed.patient}</strong></p>
                      <p>Doctor: {selectedBed.doctor}</p>
                      <p>Admitted: {selectedBed.admissionDate}</p>
                      <p>Expected Discharge: {selectedBed.expectedDischarge}</p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => updateBedStatus(selectedBed.id, 'cleaning')}>🧹 Mark for Cleaning</Button>
                    <Button size="sm" variant="outline" onClick={() => updateBedStatus(selectedBed.id, 'reserved')}>🔵 Reserve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateBedStatus(selectedBed.id, 'available')}>✅ Discharge</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">24-Hour Occupancy Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={occupancyTrend}>
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="occupancy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Weekday vs Weekend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weekdayData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="weekday" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="weekend" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="housekeeping">
          <Card>
            <CardContent className="p-4 space-y-3">
              {beds.filter(b => b.status === 'cleaning').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No beds pending cleaning 🎉</p>
              ) : (
                beds.filter(b => b.status === 'cleaning').map(bed => (
                  <div key={bed.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div>
                      <p className="text-sm font-semibold">Bed {bed.number}</p>
                      <p className="text-xs text-muted-foreground">{bed.ward}</p>
                    </div>
                    <Button size="sm" onClick={() => updateBedStatus(bed.id, 'available')}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Clean
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BedManagement;
