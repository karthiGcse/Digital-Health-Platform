import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Video, Phone, Star, Clock, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  fee: number;
  available: boolean;
  languages: string[];
  nextSlot: string;
  avatar: string;
}

const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'General Physician', experience: '12 years', rating: 4.8, fee: 500, available: true, languages: ['English', 'Hindi'], nextSlot: 'Now', avatar: 'PS' },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', experience: '18 years', rating: 4.9, fee: 1200, available: true, languages: ['English', 'Hindi', 'Tamil'], nextSlot: '2:30 PM', avatar: 'RK' },
  { id: '3', name: 'Dr. Anita Desai', specialty: 'Dermatologist', experience: '8 years', rating: 4.7, fee: 800, available: false, languages: ['English', 'Gujarati'], nextSlot: 'Tomorrow 10 AM', avatar: 'AD' },
  { id: '4', name: 'Dr. Vikram Singh', specialty: 'Orthopedic', experience: '15 years', rating: 4.6, fee: 1000, available: true, languages: ['English', 'Hindi', 'Punjabi'], nextSlot: '4:00 PM', avatar: 'VS' },
  { id: '5', name: 'Dr. Meera Patel', specialty: 'Pediatrician', experience: '10 years', rating: 4.8, fee: 600, available: true, languages: ['English', 'Hindi', 'Gujarati'], nextSlot: 'Now', avatar: 'MP' },
  { id: '6', name: 'Dr. Suresh Reddy', specialty: 'ENT Specialist', experience: '14 years', rating: 4.5, fee: 700, available: false, languages: ['English', 'Telugu'], nextSlot: 'Tomorrow 11 AM', avatar: 'SR' },
  { id: '7', name: 'Dr. Kavita Nair', specialty: 'Psychiatrist', experience: '11 years', rating: 4.9, fee: 1500, available: true, languages: ['English', 'Malayalam'], nextSlot: '5:00 PM', avatar: 'KN' },
  { id: '8', name: 'Dr. Arun Joshi', specialty: 'Neurologist', experience: '20 years', rating: 4.7, fee: 1800, available: true, languages: ['English', 'Hindi', 'Marathi'], nextSlot: '3:00 PM', avatar: 'AJ' },
];

const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

const Telemedicine = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [callDoctor, setCallDoctor] = useState<Doctor | null>(null);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === 'All' || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  const startCall = (doctor: Doctor, type: 'video' | 'audio') => {
    if (!doctor.available) { toast.error('Doctor is not available right now'); return; }
    setCallDoctor(doctor);
    setCallType(type);
    setInCall(true);
    setCallDuration(0);
    toast.success(`Connecting ${type} call with ${doctor.name}...`);
    const interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    // Store interval for cleanup
    (window as any).__callInterval = interval;
  };

  const endCall = () => {
    clearInterval((window as any).__callInterval);
    setInCall(false);
    setCallDoctor(null);
    setCallDuration(0);
    toast('Call ended');
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search doctors..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {specialties.slice(0, 5).map(s => (
            <Button key={s} variant={specialty === s ? 'default' : 'outline'} size="sm" onClick={() => setSpecialty(s)} className="text-xs">{s}</Button>
          ))}
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{d.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">{d.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="text-xs font-medium">{d.rating}</span>
                      <span className="text-xs text-muted-foreground">• {d.experience}</span>
                    </div>
                  </div>
                  <Badge variant={d.available ? 'default' : 'secondary'} className={`text-xs ${d.available ? 'bg-success text-success-foreground' : ''}`}>
                    {d.available ? 'Online' : 'Offline'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.nextSlot}</span>
                  <span className="font-semibold text-foreground">₹{d.fee}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {d.languages.map(l => <Badge key={l} variant="outline" className="text-[10px] px-1.5">{l}</Badge>)}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => startCall(d, 'video')} disabled={!d.available}>
                    <Video className="h-3.5 w-3.5 mr-1" /> Video
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => startCall(d, 'audio')} disabled={!d.available}>
                    <Phone className="h-3.5 w-3.5 mr-1" /> Audio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call Dialog */}
      <Dialog open={inCall} onOpenChange={(open) => { if (!open) endCall(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{callType === 'video' ? 'Video' : 'Audio'} Call</DialogTitle></DialogHeader>
          {callDoctor && (
            <div className="text-center space-y-6 py-6">
              <div className={`h-24 w-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${callType === 'video' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                {callType === 'video' ? <Video className="h-10 w-10" /> : <User className="h-10 w-10" />}
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">{callDoctor.name}</h3>
                <p className="text-sm text-muted-foreground">{callDoctor.specialty}</p>
              </div>
              <div className="text-3xl font-mono font-bold text-primary">{formatTime(callDuration)}</div>
              <p className="text-xs text-muted-foreground animate-pulse">Call in progress (simulated)</p>
              <Button variant="destructive" size="lg" className="rounded-full px-8" onClick={endCall}>
                <X className="h-5 w-5 mr-2" /> End Call
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Telemedicine;
