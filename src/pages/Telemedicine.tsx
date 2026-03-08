import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Video, Phone, Star, Clock, User, X, MessageCircle, Stethoscope, Building2, Mic, MicOff, VideoOff, PhoneOff, MapPin, Navigation, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Doctor {
  id: string; name: string; specialty: string; experience: string; rating: number;
  fee: number; available: boolean; languages: string[]; nextSlot: string; avatar: string;
  whatsapp: string; symptoms: string[];
}

interface Pharmacy {
  id: string; name: string; location: string; available: boolean; whatsapp: string; avatar: string; rating: number;
}

interface NearbyFacility {
  name: string; type: string; address: string; phone?: string; rating: number;
  distance_km: number; open_now: boolean; hours?: string; specialties?: string[];
  emergency_available?: boolean; whatsapp?: string;
}

interface Pharmacy {
  id: string; name: string; location: string; available: boolean; whatsapp: string; avatar: string; rating: number;
}

const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'General Physician', experience: '12 years', rating: 4.8, fee: 500, available: true, languages: ['English', 'Hindi'], nextSlot: 'Now', avatar: 'PS', whatsapp: '+919876543210', symptoms: ['Fever', 'Cold', 'Cough', 'Headache', 'Body Pain', 'Fatigue'] },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', experience: '18 years', rating: 4.9, fee: 1200, available: true, languages: ['English', 'Hindi', 'Tamil'], nextSlot: '2:30 PM', avatar: 'RK', whatsapp: '+919876543211', symptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'High BP', 'Dizziness'] },
  { id: '3', name: 'Dr. Anita Desai', specialty: 'Dermatologist', experience: '8 years', rating: 4.7, fee: 800, available: false, languages: ['English', 'Gujarati'], nextSlot: 'Tomorrow 10 AM', avatar: 'AD', whatsapp: '+919876543212', symptoms: ['Skin Rash', 'Acne', 'Eczema', 'Hair Loss', 'Itching'] },
  { id: '4', name: 'Dr. Vikram Singh', specialty: 'Orthopedic', experience: '15 years', rating: 4.6, fee: 1000, available: true, languages: ['English', 'Hindi', 'Punjabi'], nextSlot: '4:00 PM', avatar: 'VS', whatsapp: '+919876543213', symptoms: ['Joint Pain', 'Back Pain', 'Fracture', 'Knee Pain', 'Muscle Strain'] },
  { id: '5', name: 'Dr. Meera Patel', specialty: 'Pediatrician', experience: '10 years', rating: 4.8, fee: 600, available: true, languages: ['English', 'Hindi', 'Gujarati'], nextSlot: 'Now', avatar: 'MP', whatsapp: '+919876543214', symptoms: ['Child Fever', 'Vaccination', 'Growth Issues', 'Child Cough', 'Diarrhea'] },
  { id: '6', name: 'Dr. Suresh Reddy', specialty: 'ENT Specialist', experience: '14 years', rating: 4.5, fee: 700, available: false, languages: ['English', 'Telugu'], nextSlot: 'Tomorrow 11 AM', avatar: 'SR', whatsapp: '+919876543215', symptoms: ['Ear Pain', 'Sore Throat', 'Sinus', 'Hearing Loss', 'Nose Bleeding'] },
  { id: '7', name: 'Dr. Kavita Nair', specialty: 'Psychiatrist', experience: '11 years', rating: 4.9, fee: 1500, available: true, languages: ['English', 'Malayalam'], nextSlot: '5:00 PM', avatar: 'KN', whatsapp: '+919876543216', symptoms: ['Anxiety', 'Depression', 'Insomnia', 'Stress', 'Panic Attacks'] },
  { id: '8', name: 'Dr. Arun Joshi', specialty: 'Neurologist', experience: '20 years', rating: 4.7, fee: 1800, available: true, languages: ['English', 'Hindi', 'Marathi'], nextSlot: '3:00 PM', avatar: 'AJ', whatsapp: '+919876543217', symptoms: ['Migraine', 'Numbness', 'Seizures', 'Memory Loss', 'Tremors'] },
];

const pharmacies: Pharmacy[] = [
  { id: 'p1', name: 'MedPlus Pharmacy', location: 'Sector 15, Gurgaon', available: true, whatsapp: '+919800000001', avatar: 'MP', rating: 4.6 },
  { id: 'p2', name: 'Apollo Pharmacy', location: 'MG Road, Bangalore', available: true, whatsapp: '+919800000002', avatar: 'AP', rating: 4.8 },
  { id: 'p3', name: 'Netmeds Store', location: 'Anna Nagar, Chennai', available: false, whatsapp: '+919800000003', avatar: 'NM', rating: 4.5 },
  { id: 'p4', name: '1mg HealthCare', location: 'Koregaon Park, Pune', available: true, whatsapp: '+919800000004', avatar: '1M', rating: 4.7 },
];

const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];
const allSymptoms = Array.from(new Set(doctors.flatMap(d => d.symptoms)));

const doctorGradients = ['gradient-cool', 'gradient-health', 'gradient-success', 'gradient-warm', 'gradient-health', 'gradient-cool', 'gradient-health', 'gradient-warm'];

const Telemedicine = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [callDoctor, setCallDoctor] = useState<Doctor | null>(null);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors');
  const [nearbyLocation, setNearbyLocation] = useState('');
  const [nearbyFacilities, setNearbyFacilities] = useState<NearbyFacility[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbySearched, setNearbySearched] = useState(false);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()) || d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchSpecialty = specialty === 'All' || d.specialty === specialty;
    const matchSymptom = !selectedSymptom || d.symptoms.includes(selectedSymptom);
    return matchSearch && matchSpecialty && matchSymptom;
  });

  const openWhatsAppCall = (phone: string, name: string, type: 'video' | 'audio') => {
    const message = encodeURIComponent(`Hi ${name}, I'd like to schedule a ${type} consultation via WhatsApp.`);
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${message}`, '_blank');
    toast.success(`Opening WhatsApp ${type} call with ${name}`);
  };

  const startCall = (doctor: Doctor, type: 'video' | 'audio') => {
    if (!doctor.available) { toast.error('Doctor is not available right now'); return; }
    setCallDoctor(doctor); setCallType(type); setInCall(true); setCallDuration(0); setMicOn(true); setCamOn(true);
    toast.success(`Connecting ${type} call with ${doctor.name}...`);
    const interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    (window as any).__callInterval = interval;
  };

  const endCall = () => {
    clearInterval((window as any).__callInterval);
    setInCall(false); setCallDoctor(null); setCallDuration(0);
    toast('Call ended');
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="doctors" className="text-xs sm:text-sm"><Stethoscope className="h-4 w-4 mr-1.5" />Doctors</TabsTrigger>
          <TabsTrigger value="symptoms" className="text-xs sm:text-sm"><Search className="h-4 w-4 mr-1.5" />By Symptom</TabsTrigger>
          <TabsTrigger value="pharmacy" className="text-xs sm:text-sm"><Building2 className="h-4 w-4 mr-1.5" />Pharmacy</TabsTrigger>
        </TabsList>

        {/* ─── Doctors Tab ─── */}
        <TabsContent value="doctors" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search doctors or symptoms..." className="pl-10 rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {specialties.map(s => (
                <Button key={s} variant={specialty === s ? 'default' : 'outline'} size="sm" onClick={() => setSpecialty(s)}
                  className={`text-xs rounded-full ${specialty === s ? 'gradient-health text-white border-0 shadow-glow' : ''}`}>{s}</Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`h-12 w-12 rounded-xl ${doctorGradients[i % doctorGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>{d.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">{d.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="text-xs font-medium">{d.rating}</span>
                          <span className="text-xs text-muted-foreground">• {d.experience}</span>
                        </div>
                      </div>
                      <Badge variant={d.available ? 'default' : 'secondary'} className={`text-xs rounded-full ${d.available ? 'bg-success text-success-foreground' : ''}`}>
                        {d.available ? '● Online' : 'Offline'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.nextSlot}</span>
                      <span className="font-bold text-foreground text-sm">₹{d.fee}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {d.languages.map(l => <Badge key={l} variant="outline" className="text-[10px] px-1.5 rounded-full">{l}</Badge>)}
                    </div>

                    {/* In-app + WhatsApp call buttons */}
                    <div className="flex gap-2 mb-2">
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => startCall(d, 'video')} disabled={!d.available}>
                        <Video className="h-3.5 w-3.5 mr-1" /> Video
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl hover:bg-success/10 hover:text-success hover:border-success/30" onClick={() => startCall(d, 'audio')} disabled={!d.available}>
                        <Phone className="h-3.5 w-3.5 mr-1" /> Audio
                      </Button>
                    </div>
                    <Button size="sm" className="w-full rounded-xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white border-0" onClick={() => openWhatsAppCall(d.whatsapp, d.name, 'video')}>
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp Video Call
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">No doctors found for this filter.</div>
            )}
          </div>
        </TabsContent>

        {/* ─── Find Doctor by Symptom ─── */}
        <TabsContent value="symptoms" className="space-y-4">
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-heading font-semibold mb-2 flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> What symptoms are you experiencing?</h3>
            <p className="text-xs text-muted-foreground mb-3">Select a symptom to find the right specialist</p>
            <div className="flex flex-wrap gap-2">
              {allSymptoms.map(s => (
                <Button key={s} size="sm" variant={selectedSymptom === s ? 'default' : 'outline'}
                  className={`text-xs rounded-full ${selectedSymptom === s ? 'gradient-health text-white border-0' : ''}`}
                  onClick={() => setSelectedSymptom(selectedSymptom === s ? '' : s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {selectedSymptom && (
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-sm">Recommended doctors for "{selectedSymptom}"</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.filter(d => d.symptoms.includes(selectedSymptom)).map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                    <Card className="card-hover border-primary/20">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-12 w-12 rounded-xl ${doctorGradients[i % doctorGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>{d.avatar}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{d.name}</h3>
                            <p className="text-xs text-muted-foreground">{d.specialty} • {d.experience}</p>
                          </div>
                          <Badge className={`text-xs rounded-full ${d.available ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {d.available ? '● Online' : 'Offline'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 rounded-xl gradient-health text-white border-0" onClick={() => startCall(d, 'video')} disabled={!d.available}>
                            <Video className="h-3.5 w-3.5 mr-1" /> Consult Now
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white border-0" onClick={() => openWhatsAppCall(d.whatsapp, d.name, 'video')}>
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {!selectedSymptom && (
            <div className="text-center py-12 text-muted-foreground">
              <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select a symptom above to find matching specialists</p>
            </div>
          )}
        </TabsContent>

        {/* ─── Pharmacy Tab ─── */}
        <TabsContent value="pharmacy" className="space-y-4">
          <div className="rounded-2xl bg-success/5 border border-success/20 p-4 mb-2">
            <h3 className="font-heading font-semibold mb-1 flex items-center gap-2"><Building2 className="h-5 w-5 text-success" /> Connect with Pharmacies</h3>
            <p className="text-xs text-muted-foreground">Order medicines or ask about availability via WhatsApp</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pharmacies.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl gradient-success flex items-center justify-center text-white font-bold text-sm shadow-lg">{p.avatar}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="text-xs font-medium">{p.rating}</span>
                        </div>
                      </div>
                      <Badge className={`text-xs rounded-full ${p.available ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {p.available ? '● Open' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 rounded-xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white border-0" onClick={() => openWhatsAppCall(p.whatsapp, p.name, 'video')}>
                        <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> WhatsApp Video
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 rounded-xl" onClick={() => openWhatsAppCall(p.whatsapp, p.name, 'audio')}>
                        <Phone className="h-3.5 w-3.5 mr-1.5" /> WhatsApp Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Enhanced Call Dialog ─── */}
      <Dialog open={inCall} onOpenChange={(open) => { if (!open) endCall(); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className={`${callType === 'video' ? 'gradient-health' : 'gradient-cool'} p-6`}>
            <DialogHeader><DialogTitle className="text-white text-center">{callType === 'video' ? 'Video' : 'Audio'} Call</DialogTitle></DialogHeader>
          </div>
          {callDoctor && (
            <div className="text-center space-y-5 p-6">
              <div className={`h-24 w-24 mx-auto rounded-3xl flex items-center justify-center shadow-glow ${callType === 'video' ? 'gradient-health' : 'gradient-success'}`}>
                {callType === 'video' && camOn ? <Video className="h-10 w-10 text-white" /> : <User className="h-10 w-10 text-white" />}
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">{callDoctor.name}</h3>
                <p className="text-sm text-muted-foreground">{callDoctor.specialty}</p>
              </div>
              <div className="text-3xl font-mono font-bold text-primary">{formatTime(callDuration)}</div>
              <p className="text-xs text-muted-foreground animate-pulse">Call in progress (simulated)</p>

              {/* Call controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon" className={`rounded-full h-12 w-12 ${!micOn ? 'bg-destructive/10 text-destructive border-destructive/30' : ''}`} onClick={() => setMicOn(!micOn)}>
                  {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                {callType === 'video' && (
                  <Button variant="outline" size="icon" className={`rounded-full h-12 w-12 ${!camOn ? 'bg-destructive/10 text-destructive border-destructive/30' : ''}`} onClick={() => setCamOn(!camOn)}>
                    {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                )}
                <Button size="icon" className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/90 text-white shadow-lg" onClick={endCall}>
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={() => openWhatsAppCall(callDoctor.whatsapp, callDoctor.name, callType)}>
                  <MessageCircle className="h-5 w-5 text-[hsl(142,70%,45%)]" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Telemedicine;
