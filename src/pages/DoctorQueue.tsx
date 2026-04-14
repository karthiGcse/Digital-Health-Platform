import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Users, FileText, Plus, Trash2, Download, Send, Clock, CheckCircle2,
  Stethoscope, Pill, Eye, Bell, Brain, ArrowRight, AlertTriangle,
  Microscope, Syringe, FlaskConical, Scan as ScanIcon, Hash, RefreshCw,
  MessageSquare, Star, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import { useHospitalDB, HospitalTokenDB, HospitalPatientDB, HospitalVisitDB, HospitalDepartmentDB } from '@/hooks/useHospitalDB';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const medicineOptions = [
  'Paracetamol 500mg', 'Amoxicillin 250mg', 'Metformin 500mg', 'Amlodipine 5mg',
  'Omeprazole 20mg', 'Azithromycin 500mg', 'Ibuprofen 400mg', 'Cetirizine 10mg',
  'Atorvastatin 10mg', 'Losartan 50mg', 'Pantoprazole 40mg', 'Dolo 650mg',
  'Crocin 500mg', 'Montelukast 10mg', 'Salbutamol Inhaler',
];

interface PrescriptionMed {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

const DoctorQueue = () => {
  const navigate = useNavigate();
  const { getTodayTokens, updateTokenStatus, createVisit, updateVisit, createOrder, getPatientVisits, getDepartments, addNotificationLog } = useHospitalDB();

  const [tokens, setTokens] = useState<HospitalTokenDB[]>([]);
  const [patients, setPatients] = useState<Record<string, HospitalPatientDB>>({});
  const [departments, setDepartments] = useState<HospitalDepartmentDB[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [currentVisit, setCurrentVisit] = useState<HospitalVisitDB | null>(null);
  const [pastVisits, setPastVisits] = useState<HospitalVisitDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Prescription state
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<PrescriptionMed[]>([]);
  const [newMed, setNewMed] = useState<PrescriptionMed>({ name: '', dosage: '', timing: 'After Food - Morning', duration: '5 days' });
  const [followUpDays, setFollowUpDays] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadData();
    getDepartments().then(setDepartments).catch(console.error);

    // Realtime subscription for new tokens
    const channel = supabase
      .channel('doctor-queue-tokens')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_tokens' }, () => {
        loadData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadData = async () => {
    try {
      const todayTokens = await getTodayTokens();
      setTokens(todayTokens);

      // Load patient details for each token
      const patientIds = [...new Set(todayTokens.map(t => t.patient_id))];
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

  const selectedToken = tokens.find(t => t.id === selectedTokenId);
  const selectedPatient = selectedToken ? patients[selectedToken.patient_id] : null;

  const handleStartConsultation = async (token: HospitalTokenDB) => {
    setIsLoading(true);
    try {
      await updateTokenStatus(token.id, 'with_doctor');

      // Update local token status immediately so UI reflects the change
      setTokens(prev => prev.map(t => t.id === token.id ? { ...t, status: 'with_doctor' } : t));

      const visit = await createVisit({
        token_id: token.id,
        patient_id: token.patient_id,
        symptoms: token.symptoms || '',
      });
      setCurrentVisit(visit);
      setSelectedTokenId(token.id);

      // Load past visits
      try {
        const past = await getPatientVisits(token.patient_id);
        setPastVisits(past.filter(v => v.id !== visit.id));
      } catch (e) {
        console.error('Failed to load past visits:', e);
        setPastVisits([]);
      }

      try {
        await addNotificationLog({
          token_id: token.id,
          patient_id: token.patient_id,
          stage: 'with_doctor',
          message: 'Doctor is ready to see you now. Please proceed.',
        });
      } catch (e) {
        console.error('Notification log failed:', e);
      }

      toast({ title: '🩺 Consultation Started', description: `Patient token #${token.token_number}` });
      loadData();
    } catch (e: any) {
      console.error('Start consultation error:', e);
      toast({ title: 'Error starting consultation', description: e.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const addMedicine = () => {
    if (!newMed.name) return;
    setMedicines(prev => [...prev, { ...newMed }]);
    setNewMed({ name: '', dosage: '', timing: 'After Food - Morning', duration: '5 days' });
  };

  const removeMedicine = (idx: number) => setMedicines(prev => prev.filter((_, i) => i !== idx));

  const handleSendToPharmacy = async () => {
    if (!medicines.length || !diagnosis || !currentVisit || !selectedToken) {
      toast({ title: 'Incomplete', description: 'Add diagnosis and at least one medicine.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const followUp = followUpDays ? parseInt(followUpDays) : null;
      const followUpDate = followUp ? new Date(Date.now() + followUp * 86400000).toISOString().split('T')[0] : null;

      // Update visit
      await updateVisit(currentVisit.id, {
        diagnosis,
        notes,
        prescription: medicines,
        follow_up_days: followUp,
        follow_up_date: followUpDate,
        visit_stage: 'pharmacy',
        completed_at: new Date().toISOString(),
      });

      // Create pharmacy order
      await createOrder({
        visit_id: currentVisit.id,
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        order_type: 'pharmacy',
        order_details: diagnosis,
        medicines,
      });

      // Update token status
      await updateTokenStatus(selectedToken.id, 'at_pharmacy');

      // Notifications
      await addNotificationLog({
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        stage: 'at_pharmacy',
        message: `Prescription sent to pharmacy. ${medicines.length} medicine(s). Please proceed to Pharmacy Counter.`,
      });

      if (followUpDate) {
        await addNotificationLog({
          token_id: selectedToken.id,
          patient_id: selectedToken.patient_id,
          stage: 'follow_up',
          message: `Follow-up visit scheduled in ${followUpDays} days (${followUpDate}).`,
        });
      }

      toast({ title: '✅ Prescription Sent to Pharmacy', description: `${medicines.length} medicines. Patient notified.` });

      // Reset
      setMedicines([]);
      setDiagnosis('');
      setNotes('');
      setFollowUpDays('');
      setCurrentVisit(null);
      setSelectedTokenId(null);
      setShowPreview(false);
      loadData();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToScan = async (scanType: string) => {
    if (!currentVisit || !selectedToken) return;
    try {
      await createOrder({
        visit_id: currentVisit.id,
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        order_type: 'scan',
        scan_type: scanType,
        order_details: `${scanType} scan requested`,
      });
      await updateTokenStatus(selectedToken.id, 'at_scan');
      await addNotificationLog({
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        stage: 'at_scan',
        message: `Please go to Scan Centre for ${scanType}. Follow the directions on your app.`,
      });
      toast({ title: `📡 Sent to ${scanType}`, description: 'Patient and Scan Centre notified.' });
      loadData();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleSendToLab = async () => {
    if (!currentVisit || !selectedToken) return;
    try {
      await createOrder({
        visit_id: currentVisit.id,
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        order_type: 'lab',
        order_details: 'Lab tests requested',
      });
      await updateTokenStatus(selectedToken.id, 'at_lab');
      await addNotificationLog({
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        stage: 'at_lab',
        message: 'Please go to Laboratory for tests. 1st Floor.',
      });
      toast({ title: '🔬 Sent to Lab', description: 'Patient and Lab notified.' });
      loadData();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleSendToInjection = async () => {
    if (!currentVisit || !selectedToken) return;
    try {
      await createOrder({
        visit_id: currentVisit.id,
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        order_type: 'injection',
        order_details: 'Injection prescribed',
      });
      await updateTokenStatus(selectedToken.id, 'at_injection');
      await addNotificationLog({
        token_id: selectedToken.id,
        patient_id: selectedToken.patient_id,
        stage: 'at_injection',
        message: 'Please go to Injection Centre, Ground Floor.',
      });
      toast({ title: '💉 Sent to Injection Centre', description: 'Patient notified.' });
      loadData();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const downloadPDF = () => {
    if (!selectedPatient) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Smart Hospital — Digital Prescription', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name} (${selectedPatient.health_id})`, 20, 35);
    doc.text(`Gender: ${selectedPatient.gender} | Blood: ${selectedPatient.blood_group}`, 20, 42);
    doc.text(`Diagnosis: ${diagnosis}`, 20, 55);
    doc.text('Medicines:', 20, 68);
    medicines.forEach((m, i) => {
      doc.text(`${i + 1}. ${m.name} - ${m.dosage} - ${m.timing} - ${m.duration}`, 25, 78 + i * 8);
    });
    if (followUpDays) doc.text(`Follow-up: ${followUpDays} days`, 20, 88 + medicines.length * 8);
    doc.save(`prescription-${selectedPatient.health_id}.pdf`);
  };

  const waitingTokens = tokens.filter(t => ['registered', 'waiting'].includes(t.status));
  const activeTokens = tokens.filter(t => ['with_doctor', 'at_scan', 'at_lab', 'at_injection', 'at_pharmacy'].includes(t.status));

  // Safely compute same symptom count
  const sameSymptomCount = selectedToken?.symptoms
    ? pastVisits.filter(v =>
        v.symptoms &&
        v.symptoms.toLowerCase().includes((selectedToken.symptoms || '').toLowerCase().split(' ')[0])
      ).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Queue • Diagnose • Prescribe • Route</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/patient-registration')}>
            <Users className="h-4 w-4 mr-1" /> Register
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/smart-pharmacy')}>
            <Pill className="h-4 w-4 mr-1" /> Pharmacy
          </Button>
          <Button size="sm" variant="outline" onClick={loadData}>
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Patient Queue */}
        <div className="lg:col-span-4 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Patient Queue
                <Badge className="ml-auto">{waitingTokens.length} waiting</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[70vh] overflow-y-auto">
              {tokens.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No patients in queue</p>
                  <Button size="sm" variant="link" onClick={() => navigate('/patient-registration')}>Register a patient →</Button>
                </div>
              ) : (
                // Sort: emergency first, then by token number
                [...tokens]
                  .sort((a, b) => {
                    if (a.is_emergency && !b.is_emergency) return -1;
                    if (!a.is_emergency && b.is_emergency) return 1;
                    return a.token_number - b.token_number;
                  })
                  .map((t) => {
                    const patient = patients[t.patient_id];
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTokenId(t.id);
                          if (t.status === 'with_doctor' && patient) {
                            getPatientVisits(t.patient_id).then(visits => {
                              const active = visits.find(v => v.token_id === t.id);
                              if (active) setCurrentVisit(active);
                              setPastVisits(visits.filter(v => v.id !== active?.id));
                            });
                          }
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedTokenId === t.id ? 'bg-blue-500/10 border border-blue-500/30' :
                          t.is_emergency ? 'bg-red-500/5 border border-red-500/20' :
                          'bg-muted/30 hover:bg-muted/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                              ${t.is_emergency ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                              #{t.token_number}
                            </div>
                            <div>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                {patient?.name || 'Loading...'}
                                {t.is_emergency && <span className="text-red-500 text-[10px]">🚨</span>}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {patient?.health_id} • {patient?.gender}
                                {patient?.allergies && ` • ⚠️${patient.allergies}`}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{t.symptoms}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {['registered', 'waiting'].includes(t.status) && (
                              <Button size="sm" variant="outline" className="h-7 text-[10px]"
                                onClick={(e) => { e.stopPropagation(); handleStartConsultation(t); }}
                                disabled={isLoading}>
                                Start
                              </Button>
                            )}
                            <Badge className={`text-[10px] ${
                              t.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                              t.status === 'with_doctor' ? 'bg-blue-500/15 text-blue-600' :
                              t.status === 'at_pharmacy' ? 'bg-violet-500/15 text-violet-600' :
                              t.status === 'at_scan' || t.status === 'at_lab' ? 'bg-cyan-500/15 text-cyan-600' :
                              'bg-amber-500/15 text-amber-600'
                            }`}>{t.status.replace(/_/g, ' ')}</Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Patient Detail + Prescription */}
        <div className="lg:col-span-8 space-y-4">
          {selectedToken && selectedPatient ? (
            <>
              {/* Patient Profile Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-16 w-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0
                      ${selectedToken.is_emergency ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                        <Badge variant="outline" className="text-xs">{selectedPatient.health_id}</Badge>
                        <Badge className={`text-xs ${
                          selectedToken.status === 'with_doctor' ? 'bg-blue-500/15 text-blue-600' :
                          'bg-amber-500/15 text-amber-600'
                        }`}>{selectedToken.status.replace(/_/g, ' ')}</Badge>
                        {selectedToken.is_emergency && <Badge className="bg-red-500 text-white text-xs">🚨 EMERGENCY</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.gender} • {selectedPatient.blood_group && `🩸 ${selectedPatient.blood_group}`}
                        • 📞 {selectedPatient.phone}
                        • Visits: {selectedPatient.total_visits}
                      </p>

                      {/* Allergies & Chronic Diseases Alert */}
                      {(selectedPatient.allergies || selectedPatient.chronic_diseases) && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          {selectedPatient.allergies && <p className="text-xs text-amber-700">⚠️ Allergies: {selectedPatient.allergies}</p>}
                          {selectedPatient.chronic_diseases && <p className="text-xs text-amber-700">📋 Chronic: {selectedPatient.chronic_diseases}</p>}
                        </div>
                      )}

                      {/* Symptoms */}
                      <div className="mt-2 p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground">Current Symptoms</p>
                        <p className="text-sm">{selectedToken.symptoms}</p>
                        <Badge className={`mt-1 text-[10px] ${
                          selectedToken.severity === 'critical' ? 'bg-red-500/15 text-red-600' :
                          selectedToken.severity === 'moderate' ? 'bg-amber-500/15 text-amber-600' :
                          'bg-emerald-500/15 text-emerald-600'
                        }`}>{selectedToken.severity}</Badge>
                      </div>

                      {/* Same Symptom Red Alert */}
                      {sameSymptomCount > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-xs text-red-600 font-semibold">
                            🔴 Same complaint reported {sameSymptomCount + 1} times — investigate deeper
                          </p>
                        </div>
                      )}

                      {/* Past Visits Summary */}
                      {pastVisits.length > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Recent Visits ({pastVisits.length})</p>
                          {pastVisits.slice(0, 3).map(v => (
                            <div key={v.id} className="text-[10px] text-muted-foreground border-b border-border/30 py-1 last:border-0">
                              {new Date(v.created_at).toLocaleDateString()} — {v.diagnosis || 'No diagnosis'} — {(v.prescription as any[])?.length || 0} meds
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Route Actions */}
                      {currentVisit && selectedToken.status === 'with_doctor' && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground self-center font-semibold">Send to:</span>
                          {['X-Ray', 'MRI', 'CT Scan', 'Ultrasound'].map(scan => (
                            <Button key={scan} size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSendToScan(scan)}>
                              <ScanIcon className="h-3 w-3 mr-1" /> {scan}
                            </Button>
                          ))}
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleSendToLab}>
                            <FlaskConical className="h-3 w-3 mr-1" /> Lab
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleSendToInjection}>
                            <Syringe className="h-3 w-3 mr-1" /> Injection
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Writer */}
              {currentVisit && selectedToken.status === 'with_doctor' && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Digital Prescription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Diagnosis *</Label>
                        <Textarea placeholder="Enter diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="min-h-[60px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Doctor Notes</Label>
                        <Textarea placeholder="Additional notes..." value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[60px]" />
                      </div>
                    </div>

                    {/* Medicine Adder */}
                    <div className="p-3 rounded-xl bg-muted/30 border border-dashed space-y-3">
                      <p className="text-sm font-semibold flex items-center gap-2"><Pill className="h-4 w-4" /> Add Medicine</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <Label className="text-xs">Medicine</Label>
                          <Select value={newMed.name} onValueChange={v => setNewMed({ ...newMed, name: v })}>
                            <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                              {medicineOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Dosage</Label>
                          <Input placeholder="1 tab" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} className="text-xs h-9" />
                        </div>
                        <div>
                          <Label className="text-xs">Timing</Label>
                          <Select value={newMed.timing} onValueChange={v => setNewMed({ ...newMed, timing: v })}>
                            <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['Before Food - Morning', 'After Food - Morning', 'Before Food - Noon', 'After Food - Noon', 'Before Food - Night', 'After Food - Night', 'Morning + Night', 'Morning + Noon + Night'].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Duration</Label>
                          <Select value={newMed.duration} onValueChange={v => setNewMed({ ...newMed, duration: v })}>
                            <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['3 days', '5 days', '7 days', '10 days', '14 days', '30 days'].map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button size="sm" onClick={addMedicine} disabled={!newMed.name}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>

                    {/* Medicine List */}
                    {medicines.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Prescribed ({medicines.length})</p>
                        {medicines.map((m, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                              <div>
                                <p className="text-sm font-medium">{m.name}</p>
                                <p className="text-xs text-muted-foreground">{m.dosage} • {m.timing} • {m.duration}</p>
                              </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => removeMedicine(i)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Follow-up */}
                    <div className="flex items-center gap-3">
                      <Label className="text-xs whitespace-nowrap">Follow-up in:</Label>
                      <Select value={followUpDays} onValueChange={setFollowUpDays}>
                        <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="No follow-up" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No follow-up</SelectItem>
                          {['3', '5', '7', '10', '14', '30'].map(d => (
                            <SelectItem key={d} value={d}>{d} days</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!medicines.length}>
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button variant="outline" onClick={downloadPDF} disabled={!medicines.length}>
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" onClick={handleSendToPharmacy} disabled={!medicines.length || isLoading}>
                        <Send className="h-4 w-4 mr-1" /> Send to Pharmacy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview Dialog */}
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Prescription Preview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 p-4 border rounded-lg bg-background">
                    <div className="text-center border-b pb-3">
                      <h3 className="text-lg font-bold">Smart Hospital</h3>
                      <p className="text-xs text-muted-foreground">Digital Prescription</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Patient:</span> {selectedPatient?.name}</div>
                      <div><span className="text-muted-foreground">Health ID:</span> {selectedPatient?.health_id}</div>
                      <div><span className="text-muted-foreground">Gender:</span> {selectedPatient?.gender}</div>
                      <div><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</div>
                    </div>
                    <div><p className="text-sm font-medium">Diagnosis: <span className="font-normal">{diagnosis}</span></p></div>
                    <div>
                      <p className="text-sm font-medium mb-2">Medicines:</p>
                      {medicines.map((m, i) => (
                        <div key={i} className="text-sm p-1 border-b last:border-0">
                          {i + 1}. {m.name} — {m.dosage} — {m.timing} — {m.duration}
                        </div>
                      ))}
                    </div>
                    {followUpDays && <p className="text-sm">Follow-up: {followUpDays} days</p>}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-lg font-semibold text-muted-foreground">Select a patient from the queue</p>
              <p className="text-sm text-muted-foreground">Click "Start" to begin consultation</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorQueue;
