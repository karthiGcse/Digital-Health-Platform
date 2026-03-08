import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Search, Star, Clock, Video, Languages, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const specialists = [
  { id: 1, name: 'Dr. Sarah Chen', specialty: 'Oncology', country: '🇺🇸 USA', languages: ['English', 'Mandarin'], rating: 4.9, reviews: 342, price: '$150', available: 'Today', timezone: 'EST', image: '' },
  { id: 2, name: 'Dr. Hans Weber', specialty: 'Cardiology', country: '🇩🇪 Germany', languages: ['English', 'German'], rating: 4.8, reviews: 287, price: '$120', available: 'Tomorrow', timezone: 'CET', image: '' },
  { id: 3, name: 'Dr. Yuki Tanaka', specialty: 'Neurology', country: '🇯🇵 Japan', languages: ['English', 'Japanese'], rating: 4.7, reviews: 198, price: '$130', available: 'Today', timezone: 'JST', image: '' },
  { id: 4, name: 'Dr. Priya Sharma', specialty: 'Dermatology', country: '🇮🇳 India', languages: ['English', 'Hindi'], rating: 4.9, reviews: 456, price: '$45', available: 'Today', timezone: 'IST', image: '' },
  { id: 5, name: 'Dr. Carlos Rodriguez', specialty: 'Orthopedics', country: '🇪🇸 Spain', languages: ['English', 'Spanish'], rating: 4.6, reviews: 165, price: '$95', available: 'In 2 days', timezone: 'CET', image: '' },
  { id: 6, name: 'Dr. Amara Okafor', specialty: 'Pediatrics', country: '🇳🇬 Nigeria', languages: ['English', 'Yoruba'], rating: 4.8, reviews: 210, price: '$50', available: 'Today', timezone: 'WAT', image: '' },
  { id: 7, name: 'Dr. Lena Svensson', specialty: 'Psychiatry', country: '🇸🇪 Sweden', languages: ['English', 'Swedish'], rating: 4.7, reviews: 178, price: '$140', available: 'Tomorrow', timezone: 'CET', image: '' },
  { id: 8, name: 'Dr. Ahmed Hassan', specialty: 'Gastroenterology', country: '🇪🇬 Egypt', languages: ['English', 'Arabic'], rating: 4.5, reviews: 134, price: '$60', available: 'Today', timezone: 'EET', image: '' },
];

const specialties = ['All', ...new Set(specialists.map(s => s.specialty))];

const GlobalTelemedicine = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const filtered = specialists.filter(s =>
    (specialty === 'All' || s.specialty === specialty) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.specialty.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-sky-600 to-blue-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Global Telemedicine Network</h1>
          </div>
          <p className="text-white/80 text-sm">Connect with top specialists worldwide. Multi-timezone scheduling with translation support.</p>
        </div>
        <Globe className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Countries', value: new Set(specialists.map(s => s.country)).size, icon: MapPin },
          { label: 'Specialists', value: specialists.length, icon: CheckCircle2 },
          { label: 'Languages', value: new Set(specialists.flatMap(s => s.languages)).size, icon: Languages },
          { label: 'Avg Rating', value: (specialists.reduce((s, d) => s + d.rating, 0) / specialists.length).toFixed(1), icon: Star },
        ].map(s => (
          <Card key={s.label} className="rounded-card">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, specialty, or country..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Specialists Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{d.name}</h4>
                      <p className="text-xs text-muted-foreground">{d.specialty}</p>
                      <p className="text-xs">{d.country}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">{d.price}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] gap-1"><Star className="h-3 w-3 text-warning" /> {d.rating} ({d.reviews})</Badge>
                  <Badge variant="outline" className="text-[10px] gap-1"><Languages className="h-3 w-3" /> {d.languages.join(', ')}</Badge>
                  <Badge variant="outline" className="text-[10px] gap-1"><Clock className="h-3 w-3" /> {d.timezone}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`text-xs border-0 ${d.available === 'Today' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                    <Calendar className="h-3 w-3 mr-1" /> {d.available}
                  </Badge>
                  <Button size="sm" className="text-xs gap-1" onClick={() => toast.success(`Booking with ${d.name}... Check your email for confirmation.`)}>
                    <Video className="h-3 w-3" /> Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalTelemedicine;
