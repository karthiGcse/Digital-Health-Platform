import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Users, Camera, Upload, Clock, Hash, UserPlus, BedDouble, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHospital, HospitalPatient } from '@/contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';

const PatientRegistration = () => {
  const { patients, registerPatient, getAvailableBeds, assignBed } = useHospital();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', phone: '', gender: '', symptoms: '', history: '' });
  const [lastToken, setLastToken] = useState<HospitalPatient | null>(null);
  const [needsBed, setNeedsBed] = useState(false);
  const [selectedWard, setSelectedWard] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.phone || !form.gender || !form.symptoms) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    const patient = registerPatient({
      name: form.name,
      age: parseInt(form.age),
      phone: form.phone,
      gender: form.gender,
      symptoms: form.symptoms,
      history: form.history,
      photo: null,
    });
    setLastToken(patient);

    if (needsBed && selectedWard) {
      const bed = assignBed(patient.id, patient.name, selectedWard);
      if (bed) {
        toast({ title: 'Patient Registered & Bed Assigned ✓', description: `Token #${patient.token} — Bed ${bed.number} (${bed.ward})` });
      } else {
        toast({ title: 'Patient Registered ✓', description: `Token #${patient.token} — No beds available in ${selectedWard}`, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Patient Registered ✓', description: `Token #${patient.token} assigned to ${patient.name}` });
    }

    setForm({ name: '', age: '', phone: '', gender: '', symptoms: '', history: '' });
    setNeedsBed(false);
    setSelectedWard('');
  };

  const waitingCount = patients.filter(p => p.status === 'Waiting').length;
  const estimatedWait = waitingCount * 8;
  const availableBeds = getAvailableBeds();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Registration</h1>
            <p className="text-sm text-muted-foreground">Register new patients and generate queue tokens</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
            <Stethoscope className="h-4 w-4 mr-1" /> Doctor Queue
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/bed-management')}>
            <BedDouble className="h-4 w-4 mr-1" /> Beds ({availableBeds.length} free)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register">📝 Register</TabsTrigger>
          <TabsTrigger value="queue">📋 Queue ({patients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Patient Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input placeholder="Patient name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Age *</Label>
                      <Input type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required min={0} max={150} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Symptoms *</Label>
                    <Textarea placeholder="Describe symptoms..." value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Medical History</Label>
                    <Textarea placeholder="Any chronic conditions, allergies..." value={form.history} onChange={e => setForm({ ...form, history: e.target.value })} />
                  </div>

                  {/* Bed Assignment */}
                  <div className="p-3 rounded-xl bg-muted/30 border border-dashed space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium">Needs Bed Admission?</span>
                      </div>
                      <Button type="button" size="sm" variant={needsBed ? 'default' : 'outline'} onClick={() => setNeedsBed(!needsBed)}>
                        {needsBed ? 'Yes' : 'No'}
                      </Button>
                    </div>
                    {needsBed && (
                      <div className="space-y-2">
                        <Label className="text-xs">Select Ward</Label>
                        <Select value={selectedWard} onValueChange={setSelectedWard}>
                          <SelectTrigger><SelectValue placeholder="Choose ward..." /></SelectTrigger>
                          <SelectContent>
                            {['ICU', 'Emergency', 'General Ward', 'Surgery'].map(w => (
                              <SelectItem key={w} value={w}>
                                {w} ({getAvailableBeds(w).length} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-dashed">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Patient Photo</p>
                      <p className="text-xs text-muted-foreground">Upload or capture (optional)</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" className="ml-auto">
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" /> Register Patient
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {lastToken && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl font-bold text-blue-600 mb-2">#{lastToken.token}</div>
                      <p className="text-lg font-semibold text-foreground">{lastToken.name}</p>
                      <p className="text-sm text-muted-foreground">{lastToken.id}</p>
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Hash className="h-4 w-4 text-blue-500" />
                          <span>Queue: {lastToken.token}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Wait: ~{(lastToken.token - 1) * 8} min</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 justify-center">
                        <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
                          Go to Doctor Queue →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Queue Summary
                    <Badge className="bg-blue-500/15 text-blue-600">{waitingCount} waiting</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <p className="text-xl font-bold text-amber-600">{waitingCount}</p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <p className="text-xl font-bold text-blue-600">{patients.filter(p => p.status === 'In Progress').length}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <p className="text-xl font-bold text-emerald-600">{patients.filter(p => p.status === 'Completed').length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    <Clock className="h-4 w-4 inline mr-1" /> Estimated wait: ~{estimatedWait} min
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="queue">
          <Card>
            <CardContent className="p-4">
              {patients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No patients registered yet. Register a patient to see them here.</p>
              ) : (
                <div className="space-y-2">
                  {patients.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer" onClick={() => navigate('/doctor-queue')}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          #{p.token}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.id} • Age {p.age} • {p.gender}</p>
                          <p className="text-xs text-muted-foreground">{p.symptoms}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          p.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-600' :
                          p.status === 'In Progress' ? 'bg-blue-500/15 text-blue-600' :
                          'bg-amber-500/15 text-amber-600'
                        }>{p.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{p.registeredAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRegistration;
