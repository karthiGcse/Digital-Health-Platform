import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe, Search, Star, Clock, Video, Languages, MapPin, Calendar, CheckCircle2, Shield, Wifi, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const specialists = [
  { id: 1, name: 'Dr. Sarah Chen', specialty: 'Oncology', country: '🇺🇸 USA', languages: ['English', 'Mandarin'], rating: 4.9, reviews: 342, price: '$150', available: 'Today', timezone: 'EST', bio: 'Harvard Medical School graduate with 15+ years in oncology research and patient care.' },
  { id: 2, name: 'Dr. Hans Weber', specialty: 'Cardiology', country: '🇩🇪 Germany', languages: ['English', 'German'], rating: 4.8, reviews: 287, price: '$120', available: 'Tomorrow', timezone: 'CET', bio: 'Leading cardiologist at Charité Berlin, specializing in interventional cardiology.' },
  { id: 3, name: 'Dr. Yuki Tanaka', specialty: 'Neurology', country: '🇯🇵 Japan', languages: ['English', 'Japanese'], rating: 4.7, reviews: 198, price: '$130', available: 'Today', timezone: 'JST', bio: 'Neuroscience researcher at Tokyo University Hospital, expert in movement disorders.' },
  { id: 4, name: 'Dr. Priya Sharma', specialty: 'Dermatology', country: '🇮🇳 India', languages: ['English', 'Hindi'], rating: 4.9, reviews: 456, price: '$45', available: 'Today', timezone: 'IST', bio: 'Award-winning dermatologist with expertise in cosmetic and clinical dermatology.' },
  { id: 5, name: 'Dr. Carlos Rodriguez', specialty: 'Orthopedics', country: '🇪🇸 Spain', languages: ['English', 'Spanish'], rating: 4.6, reviews: 165, price: '$95', available: 'In 2 days', timezone: 'CET', bio: 'Sports medicine specialist, former team doctor for La Liga football clubs.' },
  { id: 6, name: 'Dr. Amara Okafor', specialty: 'Pediatrics', country: '🇳🇬 Nigeria', languages: ['English', 'Yoruba'], rating: 4.8, reviews: 210, price: '$50', available: 'Today', timezone: 'WAT', bio: 'Pediatric specialist passionate about child health in developing regions.' },
  { id: 7, name: 'Dr. Lena Svensson', specialty: 'Psychiatry', country: '🇸🇪 Sweden', languages: ['English', 'Swedish'], rating: 4.7, reviews: 178, price: '$140', available: 'Tomorrow', timezone: 'CET', bio: 'Cognitive behavioral therapy expert with focus on anxiety and depression.' },
  { id: 8, name: 'Dr. Ahmed Hassan', specialty: 'Gastroenterology', country: '🇪🇬 Egypt', languages: ['English', 'Arabic'], rating: 4.5, reviews: 134, price: '$60', available: 'Today', timezone: 'EET', bio: 'GI specialist with expertise in endoscopy and inflammatory bowel diseases.' },
];

const specialties = ['All', ...new Set(specialists.map(s => s.specialty))];

const avatarGradients = [
  'from-primary to-accent',
  'from-info to-primary',
  'from-success to-info',
  'from-warning to-destructive',
  'from-accent to-destructive',
  'from-primary to-success',
  'from-info to-accent',
  'from-success to-warning',
];

const GlobalTelemedicine = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<typeof specialists[0] | null>(null);

  const filtered = specialists.filter(s =>
    (specialty === 'All' || s.specialty === specialty) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.specialty.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-info/3 blur-3xl" />
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-10 text-primary-foreground"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        {/* Floating globe decoration */}
        <div className="absolute -right-6 -bottom-6 md:right-6 md:bottom-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <Globe className="h-32 w-32 md:h-40 md:w-40 text-primary-foreground/10" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="p-2 rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
              <Globe className="h-5 w-5" />
            </div>
            <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 backdrop-blur-sm text-xs">
              Live Network
            </Badge>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight mb-2">
            Global Telemedicine
          </h1>
          <p className="text-primary-foreground/70 text-sm md:text-base leading-relaxed max-w-md">
            Connect with world-class specialists across timezones. Real-time translation, secure video, and instant booking.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { icon: Shield, label: 'HIPAA Compliant' },
              { icon: Wifi, label: 'HD Video' },
              { icon: Languages, label: 'Auto-Translate' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs text-primary-foreground/60 bg-primary-foreground/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Countries', value: new Set(specialists.map(s => s.country)).size, icon: MapPin, color: 'text-primary' },
          { label: 'Specialists', value: specialists.length, icon: CheckCircle2, color: 'text-success' },
          { label: 'Languages', value: new Set(specialists.flatMap(s => s.languages)).size, icon: Languages, color: 'text-accent' },
          { label: 'Avg Rating', value: (specialists.reduce((s, d) => s + d.rating, 0) / specialists.length).toFixed(1), icon: Star, color: 'text-warning' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
          >
            <Card className="rounded-2xl border-0 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-4 text-center">
                <div className={`mx-auto mb-2 p-2 rounded-xl bg-muted/50 w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-heading font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm focus:bg-card transition-colors"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-52 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Specialists Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card
                className="rounded-2xl border-border/40 bg-card/90 backdrop-blur-sm hover:shadow-colored hover:border-primary/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => setSelectedDoc(d)}
              >
                {/* Top accent line */}
                <div className={`h-1 bg-gradient-to-r ${avatarGradients[i % avatarGradients.length]} opacity-60 group-hover:opacity-100 transition-opacity`} />
                
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">{d.name}</h4>
                        <p className="text-xs text-muted-foreground">{d.specialty}</p>
                        <p className="text-xs mt-0.5">{d.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-heading font-bold text-primary">{d.price}</p>
                      <p className="text-[10px] text-muted-foreground">per session</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-[10px] gap-1 rounded-lg border-border/50 bg-muted/30">
                      <Star className="h-3 w-3 text-warning fill-warning" /> {d.rating} ({d.reviews})
                    </Badge>
                    <Badge variant="outline" className="text-[10px] gap-1 rounded-lg border-border/50 bg-muted/30">
                      <Languages className="h-3 w-3 text-accent" /> {d.languages.join(', ')}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] gap-1 rounded-lg border-border/50 bg-muted/30">
                      <Clock className="h-3 w-3 text-info" /> {d.timezone}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Badge className={`text-xs border-0 rounded-lg ${d.available === 'Today' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                      <Calendar className="h-3 w-3 mr-1" /> {d.available}
                    </Badge>
                    <Button
                      size="sm"
                      className="text-xs gap-1.5 rounded-xl shadow-sm group-hover:shadow-glow transition-shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Booking with ${d.name}... Check your email for confirmation.`);
                      }}
                    >
                      <Video className="h-3.5 w-3.5" /> Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-16 text-center"
          >
            <Search className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No specialists found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Doctor Detail Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
          {selectedDoc && (
            <>
              {/* Dialog header gradient */}
              <div className={`h-24 bg-gradient-to-br ${avatarGradients[specialists.indexOf(selectedDoc) % avatarGradients.length]} relative`}>
                <div className="absolute -bottom-8 left-6">
                  <div className="h-16 w-16 rounded-2xl bg-card shadow-lg flex items-center justify-center text-lg font-bold text-primary border-4 border-card">
                    {selectedDoc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
              </div>

              <div className="px-6 pt-10 pb-6 space-y-4">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl">{selectedDoc.name}</DialogTitle>
                  <DialogDescription className="text-xs">
                    {selectedDoc.specialty} · {selectedDoc.country}
                  </DialogDescription>
                </DialogHeader>

                <p className="text-sm text-muted-foreground leading-relaxed">{selectedDoc.bio}</p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 rounded-xl bg-muted/40">
                    <Star className="h-4 w-4 text-warning mx-auto mb-1 fill-warning" />
                    <p className="text-sm font-bold">{selectedDoc.rating}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedDoc.reviews} reviews</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/40">
                    <Clock className="h-4 w-4 text-info mx-auto mb-1" />
                    <p className="text-sm font-bold">{selectedDoc.timezone}</p>
                    <p className="text-[10px] text-muted-foreground">Timezone</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/40">
                    <Languages className="h-4 w-4 text-accent mx-auto mb-1" />
                    <p className="text-sm font-bold">{selectedDoc.languages.length}</p>
                    <p className="text-[10px] text-muted-foreground">Languages</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.languages.map(l => (
                    <Badge key={l} variant="outline" className="text-xs rounded-lg">{l}</Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 rounded-xl gap-2 shadow-sm" onClick={() => {
                    toast.success(`Video call with ${selectedDoc.name} is being arranged!`);
                    setSelectedDoc(null);
                  }}>
                    <Video className="h-4 w-4" /> Video Call · {selectedDoc.price}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={() => toast.info('Chat feature coming soon!')}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={() => toast.info('Voice call feature coming soon!')}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalTelemedicine;
