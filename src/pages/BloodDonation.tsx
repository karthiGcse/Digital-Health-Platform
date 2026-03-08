import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CircleDot, MapPin, Heart, Calendar, Users, Bell, Plus, Droplets, Clock, Award, Phone, Search, Filter, CheckCircle, AlertTriangle, Loader2, Share2, Download, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BloodRequest {
  id: string;
  bloodType: string;
  hospital: string;
  urgency: 'Critical' | 'Urgent' | 'Normal';
  distance: string;
  units: number;
  contact: string;
  postedAt: string;
  responded: boolean;
}

interface DonationRecord {
  id: string;
  date: string;
  hospital: string;
  units: number;
  bloodType: string;
  certificate: boolean;
}

const initialRequests: BloodRequest[] = [
  { id: '1', bloodType: 'O+', hospital: 'City General Hospital', urgency: 'Critical', distance: '3 km', units: 2, contact: '+91 98765 43210', postedAt: '15 min ago', responded: false },
  { id: '2', bloodType: 'A-', hospital: 'Apollo Healthcare', urgency: 'Urgent', distance: '8 km', units: 1, contact: '+91 87654 32109', postedAt: '1 hr ago', responded: false },
  { id: '3', bloodType: 'B+', hospital: 'Max Super Specialty', urgency: 'Normal', distance: '5 km', units: 3, contact: '+91 76543 21098', postedAt: '2 hrs ago', responded: false },
  { id: '4', bloodType: 'AB+', hospital: 'Fortis Hospital', urgency: 'Critical', distance: '2 km', units: 4, contact: '+91 65432 10987', postedAt: '30 min ago', responded: false },
  { id: '5', bloodType: 'O-', hospital: 'AIIMS Trauma Center', urgency: 'Urgent', distance: '12 km', units: 2, contact: '+91 54321 09876', postedAt: '45 min ago', responded: false },
];

const donationHistory: DonationRecord[] = [
  { id: '1', date: '2026-01-15', hospital: 'City General Hospital', units: 1, bloodType: 'O+', certificate: true },
  { id: '2', date: '2025-09-20', hospital: 'Red Cross Center', units: 1, bloodType: 'O+', certificate: true },
  { id: '3', date: '2025-05-10', hospital: 'Apollo Healthcare', units: 1, bloodType: 'O+', certificate: true },
  { id: '4', date: '2025-01-08', hospital: 'Max Hospital', units: 1, bloodType: 'O+', certificate: true },
  { id: '5', date: '2024-08-22', hospital: 'Fortis Hospital', units: 1, bloodType: 'O+', certificate: false },
  { id: '6', date: '2024-03-14', hospital: 'Blood Bank Delhi', units: 1, bloodType: 'O+', certificate: true },
];

const compatibilityMap: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
  'O-': { canDonateTo: ['O-','O+','A-','A+','B-','B+','AB-','AB+'], canReceiveFrom: ['O-'] },
  'O+': { canDonateTo: ['O+','A+','B+','AB+'], canReceiveFrom: ['O-','O+'] },
  'A-': { canDonateTo: ['A-','A+','AB-','AB+'], canReceiveFrom: ['O-','A-'] },
  'A+': { canDonateTo: ['A+','AB+'], canReceiveFrom: ['O-','O+','A-','A+'] },
  'B-': { canDonateTo: ['B-','B+','AB-','AB+'], canReceiveFrom: ['O-','B-'] },
  'B+': { canDonateTo: ['B+','AB+'], canReceiveFrom: ['O-','O+','B-','B+'] },
  'AB-': { canDonateTo: ['AB-','AB+'], canReceiveFrom: ['O-','A-','B-','AB-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['O-','O+','A-','A+','B-','B+','AB-','AB+'] },
};

const BloodDonation = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);
  const [myBloodType, setMyBloodType] = useState('O+');
  const [donateDialog, setDonateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [donating, setDonating] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [newRequest, setNewRequest] = useState({ bloodType: '', hospital: '', units: '1', contact: '', urgency: 'Normal' as const });
  const [selectedType, setSelectedType] = useState('O+');

  const totalDonations = donationHistory.length;
  const livesSaved = totalDonations * 3;
  const nextEligible = '2026-04-15';
  const daysUntilEligible = Math.max(0, Math.ceil((new Date(nextEligible).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.hospital.toLowerCase().includes(searchFilter.toLowerCase()) || r.bloodType.toLowerCase().includes(searchFilter.toLowerCase());
    const matchUrgency = urgencyFilter === 'all' || r.urgency.toLowerCase() === urgencyFilter;
    return matchSearch && matchUrgency;
  });

  const handleDonate = async () => {
    if (!selectedRequest) return;
    setDonating(true);
    await new Promise(r => setTimeout(r, 2000));
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, responded: true } : r));
    setDonating(false);
    setDonateDialog(false);
    toast({ title: '🩸 Donation Response Sent!', description: `${selectedRequest.hospital} has been notified. They will contact you shortly.` });
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '🩸 Blood Donation Response',
        message: `You responded to donate ${selectedRequest.bloodType} blood at ${selectedRequest.hospital}.`,
        type: 'success',
        link: '/blood-donation',
      });
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.bloodType || !newRequest.hospital || !newRequest.contact) {
      toast({ title: 'Missing Info', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    const req: BloodRequest = {
      id: Date.now().toString(),
      bloodType: newRequest.bloodType,
      hospital: newRequest.hospital,
      urgency: newRequest.urgency as 'Critical' | 'Urgent' | 'Normal',
      distance: '0 km',
      units: parseInt(newRequest.units) || 1,
      contact: newRequest.contact,
      postedAt: 'Just now',
      responded: false,
    };
    setRequests(prev => [req, ...prev]);
    setRequestDialog(false);
    setNewRequest({ bloodType: '', hospital: '', units: '1', contact: '', urgency: 'Normal' });
    toast({ title: '📢 Blood Request Created', description: 'Nearby donors will be notified.' });
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '📢 Blood Request Posted',
        message: `Your request for ${req.bloodType} blood at ${req.hospital} is now live.`,
        type: 'info',
        link: '/blood-donation',
      });
    }
  };

  const compat = compatibilityMap[selectedType] || { canDonateTo: [], canReceiveFrom: [] };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1"><CircleDot className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Blood Donation</span></div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Blood Donation Network</h1>
            <p className="mt-1 text-white/75 text-sm">Connect blood donors with nearby recipients in real-time.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRequestDialog(true)}><Plus className="h-4 w-4 mr-1" /> Request Blood</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Your Type', value: myBloodType, icon: CircleDot, iconClass: 'stat-icon-red' },
          { label: 'Donations', value: totalDonations.toString(), icon: Heart, iconClass: 'stat-icon-green' },
          { label: 'Lives Saved', value: livesSaved.toString(), icon: Users, iconClass: 'stat-icon-purple' },
          { label: 'Next Eligible', value: daysUntilEligible > 0 ? `${daysUntilEligible}d` : 'Now!', icon: Calendar, iconClass: 'stat-icon-blue' },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search hospital or blood type..." className="pl-9" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
            </div>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full sm:w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredRequests.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/50 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-destructive">{r.bloodType}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{r.hospital}</p>
                      <p className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline" /> {r.distance} • {r.units} units • <Clock className="h-3 w-3 inline" /> {r.postedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant={r.urgency === 'Critical' ? 'destructive' : r.urgency === 'Urgent' ? 'default' : 'secondary'}>{r.urgency}</Badge>
                    {r.responded ? (
                      <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Responded</Badge>
                    ) : (
                      <Button size="sm" onClick={() => { setSelectedRequest(r); setDonateDialog(true); }}>
                        <Droplets className="h-4 w-4 mr-1" /> Donate
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No matching requests found.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" /> Your Donation History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donationHistory.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{d.hospital}</p>
                        <p className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {d.units} unit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{d.bloodType}</Badge>
                      {d.certificate && (
                        <Button size="sm" variant="ghost" onClick={() => toast({ title: '📜 Certificate Downloaded', description: `Donation certificate for ${d.hospital}.` })}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Donation Milestones</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'First Donation', target: 1, icon: '🩸' },
                { name: 'Regular Donor', target: 5, icon: '⭐' },
                { name: 'Super Donor', target: 10, icon: '🏆' },
                { name: 'Legendary Donor', target: 25, icon: '👑' },
              ].map(m => (
                <div key={m.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{m.icon} {m.name}</span>
                    <span className="text-muted-foreground">{Math.min(totalDonations, m.target)}/{m.target}</span>
                  </div>
                  <Progress value={Math.min(100, (totalDonations / m.target) * 100)} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compatibility" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Blood Type Compatibility Checker</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Blood Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(compatibilityMap).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1"><Share2 className="h-4 w-4" /> Can Donate To</h4>
                  <div className="flex flex-wrap gap-2">
                    {compat.canDonateTo.map(t => <Badge key={t} variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-300">{t}</Badge>)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1"><Droplets className="h-4 w-4" /> Can Receive From</h4>
                  <div className="flex flex-wrap gap-2">
                    {compat.canReceiveFrom.map(t => <Badge key={t} variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300">{t}</Badge>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Eligibility Checklist</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { check: 'Age between 18-65 years', pass: true },
                  { check: 'Weight above 50 kg', pass: true },
                  { check: 'No tattoo/piercing in last 6 months', pass: true },
                  { check: 'No major surgery in last 12 months', pass: true },
                  { check: 'Hemoglobin above 12.5 g/dL', pass: true },
                  { check: '56 days since last donation', pass: daysUntilEligible <= 0 },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {c.pass ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    <span className={c.pass ? '' : 'text-muted-foreground'}>{c.check}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Donor Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Blood Type</Label>
                <Select value={myBloodType} onValueChange={setMyBloodType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(compatibilityMap).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2"><Bell className="h-4 w-4" /><span className="text-sm">Emergency blood request alerts</span></div>
                <Switch checked={alertsEnabled} onCheckedChange={v => { setAlertsEnabled(v); toast({ title: v ? '🔔 Alerts Enabled' : '🔕 Alerts Disabled' }); }} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span className="text-sm">Verified Donor Status</span></div>
                <Badge variant="outline" className="text-green-600 border-green-300">Verified ✓</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Emergency Contacts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Red Cross Blood Bank', phone: '1800-XXX-XXXX', available: '24/7' },
                  { name: 'City Blood Bank', phone: '+91 11-XXXX-XXXX', available: '8AM-8PM' },
                  { name: 'National Blood Helpline', phone: '104', available: '24/7' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.available}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: `📞 Calling ${c.name}` })}>
                      <Phone className="h-4 w-4 mr-1" /> Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Donate Dialog */}
      <Dialog open={donateDialog} onOpenChange={setDonateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Blood Donation</DialogTitle></DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-destructive">{selectedRequest.bloodType}</span>
                </div>
                <p className="font-semibold">{selectedRequest.hospital}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.units} units needed • {selectedRequest.urgency}</p>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Contact:</strong> {selectedRequest.contact}</p>
                <p><strong>Distance:</strong> {selectedRequest.distance}</p>
                <p><strong>Posted:</strong> {selectedRequest.postedAt}</p>
              </div>
              {donating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Notifying hospital...</div>
                  <Progress value={65} className="h-2" />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonateDialog(false)} disabled={donating}>Cancel</Button>
            <Button onClick={handleDonate} disabled={donating}>{donating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Confirming...</> : <><Droplets className="h-4 w-4 mr-1" /> Confirm Donation</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Blood Dialog */}
      <Dialog open={requestDialog} onOpenChange={setRequestDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Blood</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Blood Type Needed *</Label>
              <Select value={newRequest.bloodType} onValueChange={v => setNewRequest(p => ({ ...p, bloodType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(compatibilityMap).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hospital / Location *</Label>
              <Input value={newRequest.hospital} onChange={e => setNewRequest(p => ({ ...p, hospital: e.target.value }))} placeholder="Hospital name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Units</Label>
                <Input type="number" min="1" max="10" value={newRequest.units} onChange={e => setNewRequest(p => ({ ...p, units: e.target.value }))} />
              </div>
              <div>
                <Label>Urgency</Label>
                <Select value={newRequest.urgency} onValueChange={v => setNewRequest(p => ({ ...p, urgency: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Contact Number *</Label>
              <Input value={newRequest.contact} onChange={e => setNewRequest(p => ({ ...p, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateRequest}><Plus className="h-4 w-4 mr-1" /> Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodDonation;
