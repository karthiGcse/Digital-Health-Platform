import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Users, Camera, Upload, Clock, Hash, UserPlus, Stethoscope, Search,
  QrCode, AlertCircle, Zap, Calendar, ArrowRight, Phone, CreditCard,
  Globe, History, Star, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHospitalDB, HospitalPatientDB, HospitalTokenDB, HospitalDepartmentDB } from '@/hooks/useHospitalDB';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const severityMap: Record<string, { color: string; label: string; priority: number }> = {
  mild: { color: 'bg-emerald-500/15 text-emerald-600', label: 'Mild', priority: 0 },
  moderate: { color: 'bg-amber-500/15 text-amber-600', label: 'Moderate', priority: 1 },
  critical: { color: 'bg-red-500/15 text-red-600', label: 'Critical ⚡', priority: 2 },
};

const symptomDepartmentMap: Record<string, string> = {
  'fever': 'General Medicine', 'cold': 'General Medicine', 'cough': 'General Medicine', 'headache': 'General Medicine',
  'child': 'Pediatrics', 'baby': 'Pediatrics', 'infant': 'Pediatrics',
  'pregnancy': 'Gynecology', 'women': 'Gynecology', 'menstrual': 'Gynecology',
  'chest pain': 'Cardiology', 'bp': 'Cardiology', 'heart': 'Cardiology',
  'bone': 'Orthopedics', 'fracture': 'Orthopedics', 'joint': 'Orthopedics',
  'eye': 'Ophthalmology', 'vision': 'Ophthalmology',
  'teeth': 'Dentistry', 'tooth': 'Dentistry', 'dental': 'Dentistry',
  'stress': 'Psychiatry', 'anxiety': 'Psychiatry', 'depression': 'Psychiatry',
};

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { searchPatient, registerPatient, createToken, getDepartments, getTodayTokens, addNotificationLog } = useHospitalDB();

  const [departments, setDepartments] = useState<HospitalDepartmentDB[]>([]);
  const [todayTokens, setTodayTokens] = useState<HospitalTokenDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastToken, setLastToken] = useState<(HospitalTokenDB & { patientName: string; healthId: string }) | null>(null);
  const [existingPatient, setExistingPatient] = useState<HospitalPatientDB | null>(null);
  const [searchResults, setSearchResults] = useState<HospitalPatientDB[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', aadhaar: '', email: '', gender: '', date_of_birth: '',
    blood_group: '', allergies: '', chronic_diseases: '', language_preference: 'en',
    symptoms: '', severity: 'mild', department_id: '', entry_type: 'offline' as 'online' | 'offline',
    is_emergency: false,
  });

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
    loadTodayTokens();
  }, []);

  const loadTodayTokens = async () => {
    try {
      const tokens = await getTodayTokens();
      setTodayTokens(tokens);
    } catch (e) { console.error(e); }
  };

  // Auto-suggest department from symptoms
  useEffect(() => {
    if (!form.symptoms) return;
    const lower = form.symptoms.toLowerCase();
    for (const [keyword, dept] of Object.entries(symptomDepartmentMap)) {
      if (lower.includes(keyword)) {
        const found = departments.find(d => d.name === dept);
        if (found && form.department_id !== found.id) {
          setForm(prev => ({ ...prev, department_id: found.id }));
          toast({ title: `🤖 AI Suggestion`, description: `Based on symptoms, suggested: ${dept}` });
        }
        break;
      }
    }
  }, [form.symptoms, departments]);

  // Search patient by phone/aadhaar
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const results = await searchPatient(query);
      setSearchResults(results);
      setShowSearch(results.length > 0);
    } catch (e) { console.error(e); }
  }, [searchPatient]);

  const selectExistingPatient = (patient: HospitalPatientDB) => {
    setExistingPatient(patient);
    setForm(prev => ({
      ...prev,
      name: patient.name,
      phone: patient.phone,
      aadhaar: patient.aadhaar,
      email: patient.email,
      gender: patient.gender,
      date_of_birth: patient.date_of_birth || '',
      blood_group: patient.blood_group,
      allergies: patient.allergies,
      chronic_diseases: patient.chronic_diseases,
      language_preference: patient.language_preference,
    }));
    setShowSearch(false);
    setSearchQuery('');
    toast({ title: '👋 Welcome Back!', description: `${patient.name} — ${patient.total_visits} previous visits. Health ID: ${patient.health_id}` });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.gender || !form.symptoms) {
      toast({ title: 'Missing fields', description: 'Fill all required fields.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      // Step 1: Register or use existing patient
      let patient: HospitalPatientDB;
      if (existingPatient) {
        patient = existingPatient;
      } else {
        patient = await registerPatient({
          name: form.name,
          phone: form.phone,
          aadhaar: form.aadhaar,
          email: form.email,
          gender: form.gender,
          date_of_birth: form.date_of_birth || undefined,
          blood_group: form.blood_group,
          allergies: form.allergies,
          chronic_diseases: form.chronic_diseases,
          language_preference: form.language_preference,
        });
      }

      // Step 2: Create token
      const token = await createToken({
        patient_id: patient.id,
        department_id: form.department_id || undefined,
        entry_type: form.entry_type,
        is_emergency: form.is_emergency,
        severity: form.severity,
        symptoms: form.symptoms,
      });

      // Step 3: Generate QR code data
      const qrData = JSON.stringify({ tokenId: token.id, healthId: patient.health_id, token: token.token_number });

      setLastToken({ ...token, patientName: patient.name, healthId: patient.health_id });

      // Step 4: Log notification
      await addNotificationLog({
        token_id: token.id,
        patient_id: patient.id,
        stage: 'registered',
        message: `Token #${token.token_number} assigned. ${form.is_emergency ? '⚡ EMERGENCY PRIORITY' : `Estimated wait: ~${token.token_number * 8} min`}`,
      });

      toast({
        title: form.is_emergency ? '🚨 Emergency Token Created!' : '✅ Patient Registered!',
        description: `Token #${token.token_number} → ${patient.name} (${patient.health_id})`,
      });

      // Reset
      setForm({
        name: '', phone: '', aadhaar: '', email: '', gender: '', date_of_birth: '',
        blood_group: '', allergies: '', chronic_diseases: '', language_preference: 'en',
        symptoms: '', severity: 'mild', department_id: '', entry_type: 'offline', is_emergency: false,
      });
      setExistingPatient(null);
      loadTodayTokens();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Registration failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const waitingCount = todayTokens.filter(t => t.status === 'registered' || t.status === 'waiting').length;
  const inProgressCount = todayTokens.filter(t => t.status === 'with_doctor').length;
  const completedCount = todayTokens.filter(t => t.status === 'completed').length;
  const emergencyCount = todayTokens.filter(t => t.is_emergency && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Registration</h1>
            <p className="text-sm text-muted-foreground">Register patients • Generate tokens • Zero paperwork</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
            <Stethoscope className="h-4 w-4 mr-1" /> Doctor Queue
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Today Total', value: todayTokens.length, icon: Hash, color: 'from-blue-500 to-cyan-500' },
          { label: 'Waiting', value: waitingCount, icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'With Doctor', value: inProgressCount, icon: Stethoscope, color: 'from-violet-500 to-purple-500' },
          { label: 'Completed', value: completedCount, icon: Star, color: 'from-emerald-500 to-teal-500' },
          { label: 'Emergency', value: emergencyCount, icon: AlertCircle, color: 'from-red-500 to-rose-500' },
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

      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register">📝 Register</TabsTrigger>
          <TabsTrigger value="queue">📋 Queue ({todayTokens.length})</TabsTrigger>
          <TabsTrigger value="search">🔍 Find Patient</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Registration Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    New Patient / Return Visit
                    {existingPatient && (
                      <Badge className="bg-emerald-500/15 text-emerald-600">
                        ✅ Returning: {existingPatient.health_id}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Quick Search */}
                  <div className="mb-4 relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by phone, Aadhaar, name, or Health ID..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={e => handleSearch(e.target.value)}
                        />
                      </div>
                      {existingPatient && (
                        <Button variant="outline" size="sm" onClick={() => { setExistingPatient(null); setForm(prev => ({ ...prev, name: '', phone: '', aadhaar: '', email: '', gender: '', date_of_birth: '', blood_group: '', allergies: '', chronic_diseases: '' })); }}>
                          <RefreshCw className="h-4 w-4 mr-1" /> New Patient
                        </Button>
                      )}
                    </div>
                    {showSearch && searchResults.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-background border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map(p => (
                          <div key={p.id} className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-0" onClick={() => selectExistingPatient(p)}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.health_id} • {p.phone} • {p.gender}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="text-[10px]">{p.total_visits} visits</Badge>
                                {p.last_visit_date && <p className="text-[10px] text-muted-foreground mt-0.5">Last: {p.last_visit_date}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Entry Type & Emergency */}
                    <div className="flex gap-3">
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant={form.entry_type === 'offline' ? 'default' : 'outline'}
                          onClick={() => setForm(prev => ({ ...prev, entry_type: 'offline' }))}>
                          🏥 Walk-in
                        </Button>
                        <Button type="button" size="sm" variant={form.entry_type === 'online' ? 'default' : 'outline'}
                          onClick={() => setForm(prev => ({ ...prev, entry_type: 'online' }))}>
                          🌐 Online
                        </Button>
                      </div>
                      <Button type="button" size="sm"
                        variant={form.is_emergency ? 'destructive' : 'outline'}
                        onClick={() => setForm(prev => ({ ...prev, is_emergency: !prev.is_emergency, severity: !prev.is_emergency ? 'critical' : 'mild' }))}>
                        <AlertCircle className="h-4 w-4 mr-1" /> {form.is_emergency ? '🚨 EMERGENCY' : 'Emergency'}
                      </Button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Full Name *</Label>
                        <Input placeholder="Patient name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={!!existingPatient} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Phone *</Label>
                        <Input placeholder="Phone number" value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value }); if (!existingPatient) handleSearch(e.target.value); }} required disabled={!!existingPatient} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Gender *</Label>
                        <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })} disabled={!!existingPatient}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date of Birth</Label>
                        <Input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} disabled={!!existingPatient} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Blood Group</Label>
                        <Select value={form.blood_group} onValueChange={v => setForm({ ...form, blood_group: v })} disabled={!!existingPatient}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Aadhaar ID</Label>
                        <Input placeholder="Aadhaar number" value={form.aadhaar} onChange={e => { setForm({ ...form, aadhaar: e.target.value }); if (!existingPatient) handleSearch(e.target.value); }} disabled={!!existingPatient} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Language</Label>
                        <Select value={form.language_preference} onValueChange={v => setForm({ ...form, language_preference: v })} disabled={!!existingPatient}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ta">தமிழ்</SelectItem>
                            <SelectItem value="hi">हिन्दी</SelectItem>
                            <SelectItem value="te">తెలుగు</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                            <SelectItem value="ml">മലയാളം</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Allergies</Label>
                        <Input placeholder="Known allergies" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} disabled={!!existingPatient} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Chronic Diseases</Label>
                        <Input placeholder="Diabetes, BP, etc." value={form.chronic_diseases} onChange={e => setForm({ ...form, chronic_diseases: e.target.value })} disabled={!!existingPatient} />
                      </div>
                    </div>

                    {/* Symptoms & Department */}
                    <div className="p-3 rounded-xl bg-muted/30 border border-dashed space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Symptoms * (AI auto-assigns department)</Label>
                        <Textarea placeholder="Describe symptoms... e.g. 'headache and fever for 3 days'" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Severity</Label>
                          <Select value={form.severity} onValueChange={v => setForm({ ...form, severity: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">🟢 Mild</SelectItem>
                              <SelectItem value="moderate">🟡 Moderate</SelectItem>
                              <SelectItem value="critical">🔴 Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Department {form.department_id && '(AI suggested ✨)'}</Label>
                          <Select value={form.department_id} onValueChange={v => setForm({ ...form, department_id: v })}>
                            <SelectTrigger><SelectValue placeholder="Auto or manual" /></SelectTrigger>
                            <SelectContent>
                              {departments.filter(d => !['Laboratory', 'Injection Centre', 'Pharmacy', 'Radiology'].includes(d.name)).map(d => (
                                <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white" disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                      {form.is_emergency ? '🚨 Register Emergency' : existingPatient ? '🔄 Create Return Visit Token' : '📋 Register & Generate Token'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Token + Summary */}
            <div className="lg:col-span-2 space-y-4">
              {/* Last Token */}
              <AnimatePresence>
                {lastToken && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <Card className={`border-2 ${lastToken.is_emergency ? 'border-red-500/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30' : 'border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'}`}>
                      <CardContent className="p-6 text-center">
                        {lastToken.is_emergency && <Badge className="bg-red-500 text-white mb-2">🚨 EMERGENCY</Badge>}
                        <div className="text-6xl font-bold text-blue-600 mb-2">#{lastToken.token_number}</div>
                        <p className="text-lg font-semibold text-foreground">{lastToken.patientName}</p>
                        <p className="text-sm text-muted-foreground">{lastToken.healthId}</p>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span className="font-semibold text-blue-600">✅ Registered</span>
                            <span>Doctor</span>
                            <span>Scan/Lab</span>
                            <span>Pharmacy</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Hash className="h-4 w-4 text-blue-500" />
                            <span>Token: {lastToken.token_number}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span>Wait: ~{lastToken.is_emergency ? '0' : (lastToken.token_number * 8)} min</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-background/50 border">
                          <QrCode className="h-16 w-16 mx-auto text-muted-foreground/30 mb-1" />
                          <p className="text-[10px] text-muted-foreground">QR Code for token</p>
                        </div>

                        <Button size="sm" className="mt-4" onClick={() => navigate('/doctor-queue')}>
                          Go to Doctor Queue <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Queue Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    Queue Summary
                    <Button size="sm" variant="ghost" onClick={loadTodayTokens}><RefreshCw className="h-3 w-3" /></Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <p className="text-xl font-bold text-amber-600">{waitingCount}</p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <p className="text-xl font-bold text-blue-600">{inProgressCount}</p>
                      <p className="text-xs text-muted-foreground">With Doctor</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <p className="text-xl font-bold text-emerald-600">{completedCount}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10">
                      <p className="text-xl font-bold text-red-600">{emergencyCount}</p>
                      <p className="text-xs text-muted-foreground">Emergency</p>
                    </div>
                  </div>
                  {waitingCount > 10 && (
                    <div className="mt-3 p-2 rounded-lg bg-red-500/10 text-red-600 text-xs text-center">
                      ⚠️ High Rush Today — Expected wait {waitingCount * 8} mins
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue">
          <Card>
            <CardContent className="p-4">
              {todayTokens.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tokens generated today.</p>
              ) : (
                <div className="space-y-2">
                  {/* Emergency tokens first, then by number */}
                  {[...todayTokens]
                    .sort((a, b) => {
                      if (a.is_emergency && !b.is_emergency) return -1;
                      if (!a.is_emergency && b.is_emergency) return 1;
                      return a.token_number - b.token_number;
                    })
                    .map((t) => (
                    <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer
                      ${t.is_emergency ? 'bg-red-500/10 border border-red-500/20' : 'bg-muted/30 hover:bg-muted/60'}`}
                      onClick={() => navigate('/doctor-queue')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                          ${t.is_emergency ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                          #{t.token_number}
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2">
                            Token #{t.token_number}
                            {t.is_emergency && <Badge className="bg-red-500 text-white text-[9px]">EMERGENCY</Badge>}
                            {t.is_follow_up && <Badge variant="outline" className="text-[9px]">Follow-up</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">{t.symptoms?.substring(0, 60) || 'No symptoms'}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {severityMap[t.severity]?.label || 'Mild'} • {t.entry_type === 'online' ? '🌐 Online' : '🏥 Walk-in'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          t.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                          t.status === 'with_doctor' ? 'bg-blue-500/15 text-blue-600' :
                          t.status === 'at_pharmacy' ? 'bg-violet-500/15 text-violet-600' :
                          'bg-amber-500/15 text-amber-600'
                        }>{t.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by phone, Aadhaar, name, or Health ID..."
                  className="pl-10"
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.health_id} • {p.phone} • {p.gender}</p>
                          <div className="flex gap-2 mt-1">
                            {p.blood_group && <Badge variant="outline" className="text-[10px]">🩸 {p.blood_group}</Badge>}
                            {p.allergies && <Badge variant="outline" className="text-[10px]">⚠️ {p.allergies}</Badge>}
                            {p.chronic_diseases && <Badge variant="outline" className="text-[10px]">📋 {p.chronic_diseases}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold">{p.total_visits} visits</p>
                        {p.last_visit_date && <p className="text-xs text-muted-foreground">Last: {p.last_visit_date}</p>}
                        <Button size="sm" onClick={() => { selectExistingPatient(p); /* switch to register tab */ }}>
                          Create Visit <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Search for patients by phone, Aadhaar, name, or Health ID</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRegistration;
