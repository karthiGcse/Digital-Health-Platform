import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Phone, Star, Clock, Loader2, Building2, Sparkles, AlertCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Facility {
  name: string; type: string; address: string; phone?: string; rating: number;
  distance_km: number; open_now: boolean; hours?: string; specialties?: string[]; emergency_available?: boolean;
}

const serviceTypes = ['All', 'Hospital', 'Pharmacy', 'Clinic', 'Lab', 'Emergency'];
const typeIcons: Record<string, string> = { hospital: '🏥', pharmacy: '💊', clinic: '🩺', lab: '🔬', emergency: '🚨' };
const typeGradients: Record<string, string> = {
  hospital: 'gradient-cool', pharmacy: 'gradient-success', clinic: 'gradient-warm',
  lab: 'gradient-health', emergency: 'gradient-danger',
};

const NearbyServices = () => {
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('All');
  const [query, setQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchFacilities = async () => {
    if (!location.trim()) { toast.error('Enter your location'); return; }
    setLoading(true); setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('nearby-services', {
        body: { location, service_type: serviceType === 'All' ? undefined : serviceType.toLowerCase(), query: query || undefined },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setFacilities(data.facilities || []);
      setRecommendation(data.recommendation || '');
    } catch (e: any) { toast.error(e.message || 'Search failed'); }
    finally { setLoading(false); }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); toast.success('Location detected'); },
      () => toast.error('Location access denied')
    );
  };

  const filtered = serviceType === 'All' ? facilities : facilities.filter(f => f.type === serviceType.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="card-hover border-0 shadow-colored">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter location (city, area, or pin code)" className="pl-10 rounded-xl" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" onClick={detectLocation} title="Detect my location" className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-full sm:w-48 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{serviceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="What do you need? (e.g. 24hr pharmacy, orthopedic)" className="pl-10 rounded-xl" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <Button onClick={searchFacilities} disabled={loading} className="gradient-health text-white border-0 shadow-glow hover:opacity-90 rounded-xl">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> Find</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <AnimatePresence>
        {recommendation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="card-hover border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="stat-icon-purple h-9 w-9 shrink-0"><Sparkles className="h-4 w-4" /></div>
                <p className="text-sm pt-1">{recommendation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {searched && !loading && filtered.length === 0 && (
        <Card className="card-hover">
          <CardContent className="p-12 text-center">
            <div className="stat-icon-blue mx-auto mb-4 h-16 w-16"><Building2 className="h-8 w-8" /></div>
            <h3 className="font-heading font-semibold text-lg mb-2">No Facilities Found</h3>
            <p className="text-sm text-muted-foreground">Try a different location or service type.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((f, i) => (
            <motion.div key={`${f.name}-${i}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-hover h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg ${typeGradients[f.type] || 'gradient-cool'} shadow-md`}>
                      <span className="text-white">{typeIcons[f.type] || '🏢'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.emergency_available && <Badge variant="destructive" className="text-[10px] rounded-full"><AlertCircle className="h-3 w-3 mr-0.5" />24/7</Badge>}
                      <Badge variant={f.open_now ? 'default' : 'secondary'} className={`text-xs rounded-full ${f.open_now ? 'bg-success text-success-foreground' : ''}`}>
                        {f.open_now ? '● Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-1">{f.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 flex items-start gap-1">
                    <MapPin className="h-3 w-3 shrink-0 mt-0.5" />{f.address}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{f.rating}</span>
                    <span className="flex items-center gap-1"><Navigation className="h-3 w-3" />{f.distance_km} km</span>
                    {f.hours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{f.hours}</span>}
                  </div>

                  {f.specialties && f.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {f.specialties.slice(0, 3).map(s => <Badge key={s} variant="outline" className="text-[10px] px-1.5 rounded-full">{s}</Badge>)}
                    </div>
                  )}

                  <div className="mt-auto flex gap-2">
                    {f.phone && (
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl hover:bg-success/10 hover:text-success" onClick={() => window.open(`tel:${f.phone}`)}>
                        <Phone className="h-3.5 w-3.5 mr-1" /> Call
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(f.name + ' ' + f.address)}`)}>
                      <MapPin className="h-3.5 w-3.5 mr-1" /> Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyServices;
