import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users, FileText, Plus, Trash2, Download, Send, Clock,
  CheckCircle2, Stethoscope, Pill, Eye, BedDouble, Bell, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useHospital, PrescriptionMedicine } from '@/contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';

const medicineOptions = [
  'Paracetamol 500mg', 'Amoxicillin 250mg', 'Metformin 500mg', 'Amlodipine 5mg',
  'Omeprazole 20mg', 'Azithromycin 500mg', 'Ibuprofen 400mg', 'Cetirizine 10mg',
  'Atorvastatin 10mg', 'Losartan 50mg', 'Pantoprazole 40mg', 'Dolo 650mg',
  'Crocin 500mg', 'Montelukast 10mg', 'Salbutamol Inhaler',
];

const DoctorQueue = () => {
  const { patients, updatePatientStatus, addPrescription, getAvailableBeds, assignBed } = useHospital();
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);
  const [newMed, setNewMed] = useState<PrescriptionMedicine>({ name: '', dosage: '', timing: 'After Food - Morning', duration: '5 days' });
  const [showPreview, setShowPreview] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const addMedicine = () => {
    if (!newMed.name) return;
    setMedicines(prev => [...prev, { ...newMed }]);
    setNewMed({ name: '', dosage: '', timing: 'After Food - Morning', duration: '5 days' });
  };

  const removeMedicine = (idx: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== idx));
  };

  const handleStartConsultation = (patientId: string) => {
    updatePatientStatus(patientId, 'In Progress');
    setSelectedPatientId(patientId);
  };

  const handleSendToPharmacy = () => {
    if (!medicines.length || !diagnosis) {
      toast({ title: 'Incomplete', description: 'Add diagnosis and at least one medicine.', variant: 'destructive' });
      return;
    }
    if (selectedPatient) {
      addPrescription({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        diagnosis,
        medicines,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      });
      updatePatientStatus(selectedPatient.id, 'Completed');
    }
    toast({ title: 'Prescription Sent ✓', description: 'Sent to pharmacy and patient notified.' });
    setMedicines([]);
    setDiagnosis('');
    setShowPreview(false);
  };

  const handleAdmitPatient = (ward: string) => {
    if (!selectedPatient) return;
    const bed = assignBed(selectedPatient.id, selectedPatient.name, ward);
    if (bed) {
      toast({ title: 'Bed Assigned ✓', description: `${selectedPatient.name} → Bed ${bed.number} (${ward})` });
    } else {
      toast({ title: 'No beds available', description: `No free beds in ${ward}`, variant: 'destructive' });
    }
  };

  const downloadPDF = () => {
    if (!selectedPatient) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Digital Prescription', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name} (${selectedPatient.id})`, 20, 35);
    doc.text(`Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender}`, 20, 42);
    doc.text(`Diagnosis: ${diagnosis}`, 20, 52);
    doc.text('Medicines:', 20, 65);
    medicines.forEach((m, i) => {
      doc.text(`${i + 1}. ${m.name} - ${m.dosage} - ${m.timing} - ${m.duration}`, 25, 75 + i * 8);
    });
    doc.save(`prescription-${selectedPatient.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Doctor Queue & Prescription</h1>
            <p className="text-sm text-muted-foreground">Manage patients and write prescriptions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/patient-registration')}>
            <Users className="h-4 w-4 mr-1" /> Register
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/bed-management')}>
            <BedDouble className="h-4 w-4 mr-1" /> Beds
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/ai-assistant')}>
            <Brain className="h-4 w-4 mr-1" /> AI Assist
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/smart-pharmacy')}>
            <Pill className="h-4 w-4 mr-1" /> Pharmacy
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
                <Badge className="ml-auto">{patients.filter(p => p.status === 'Waiting').length} waiting</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[70vh] overflow-y-auto">
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No patients in queue</p>
                  <Button size="sm" variant="link" onClick={() => navigate('/patient-registration')}>Register a patient →</Button>
                </div>
              ) : (
                patients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${selectedPatientId === p.id ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-muted/30 hover:bg-muted/60'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          #{p.token}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.id} • {p.age}y • {p.gender}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.status === 'Waiting' && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={(e) => { e.stopPropagation(); handleStartConsultation(p.id); }}>
                            Start
                          </Button>
                        )}
                        <Badge className={
                          p.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-600 text-[10px]' :
                          p.status === 'In Progress' ? 'bg-blue-500/15 text-blue-600 text-[10px]' :
                          'bg-amber-500/15 text-amber-600 text-[10px]'
                        }>{p.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Patient Detail + Prescription */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPatient ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                        <Badge variant="outline" className="text-xs">{selectedPatient.id}</Badge>
                        <Badge className={
                          selectedPatient.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-600' :
                          selectedPatient.status === 'In Progress' ? 'bg-blue-500/15 text-blue-600' :
                          'bg-amber-500/15 text-amber-600'
                        }>{selectedPatient.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Age {selectedPatient.age} • {selectedPatient.gender} • Phone: {selectedPatient.phone}</p>
                      <div className="mt-3 p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground">Symptoms</p>
                        <p className="text-sm">{selectedPatient.symptoms}</p>
                      </div>
                      {selectedPatient.history && (
                        <div className="mt-2 p-2 rounded-lg bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground">Medical History</p>
                          <p className="text-sm">{selectedPatient.history}</p>
                        </div>
                      )}
                      {/* Admit to Bed */}
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground self-center">Admit to:</span>
                        {['ICU', 'Emergency', 'General Ward', 'Surgery'].map(w => (
                          <Button key={w} size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAdmitPatient(w)}>
                            <BedDouble className="h-3 w-3 mr-1" /> {w} ({getAvailableBeds(w).length})
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Writer */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Digital Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Diagnosis</Label>
                    <Textarea placeholder="Enter diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="min-h-[60px]" />
                  </div>

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
                      <Plus className="h-4 w-4 mr-1" /> Add to Prescription
                    </Button>
                  </div>

                  {medicines.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Prescribed Medicines ({medicines.length})</p>
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

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!medicines.length}>
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline" onClick={downloadPDF} disabled={!medicines.length}>
                      <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" onClick={handleSendToPharmacy} disabled={!medicines.length}>
                      <Send className="h-4 w-4 mr-2" /> Save & Send to Pharmacy
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/patient-notifications')}>
                      <Bell className="h-4 w-4 mr-2" /> Notify Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Prescription Preview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 p-4 border rounded-lg bg-white dark:bg-slate-900">
                    <div className="text-center border-b pb-3">
                      <h3 className="text-lg font-bold">Smart Hospital</h3>
                      <p className="text-xs text-muted-foreground">Digital Prescription</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Patient:</span> {selectedPatient.name}</div>
                      <div><span className="text-muted-foreground">ID:</span> {selectedPatient.id}</div>
                      <div><span className="text-muted-foreground">Age/Gender:</span> {selectedPatient.age}/{selectedPatient.gender}</div>
                      <div><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Diagnosis: <span className="font-normal">{diagnosis}</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Rx:</p>
                      {medicines.map((m, i) => (
                        <div key={i} className="text-sm py-1 border-b last:border-0">
                          {i + 1}. {m.name} — {m.dosage} — {m.timing} — {m.duration}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                {patients.length === 0 ? 'No patients registered yet' : 'Select a patient from the queue'}
              </p>
              {patients.length === 0 && (
                <Button size="sm" variant="link" onClick={() => navigate('/patient-registration')}>Register a patient →</Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorQueue;
