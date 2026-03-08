import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Clock, Users, Calendar as CalendarIcon, MapPin, CheckCircle2, Trash2, Loader2, ArrowRight, ArrowLeft, Activity, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, isBefore, startOfToday, parseISO, isAfter } from 'date-fns';

const hospitals = [
  { id: 1, name: 'City General Hospital', departments: [
    { name: 'General OPD', wait: 25, queue: 12, capacity: 40 },
    { name: 'Cardiology', wait: 45, queue: 8, capacity: 15 },
    { name: 'Orthopedics', wait: 30, queue: 6, capacity: 20 },
    { name: 'Dermatology', wait: 15, queue: 3, capacity: 25 },
  ], distance: '2.3 km', address: '123 Main St, City Center' },
  { id: 2, name: 'Apollo Medical Center', departments: [
    { name: 'General OPD', wait: 15, queue: 5, capacity: 50 },
    { name: 'Pediatrics', wait: 20, queue: 7, capacity: 20 },
    { name: 'ENT', wait: 10, queue: 2, capacity: 15 },
    { name: 'Neurology', wait: 55, queue: 10, capacity: 12 },
  ], distance: '4.1 km', address: '456 Apollo Rd, Health District' },
  { id: 3, name: 'Max Healthcare', departments: [
    { name: 'General OPD', wait: 35, queue: 15, capacity: 35 },
    { name: 'Gynecology', wait: 40, queue: 9, capacity: 18 },
    { name: 'Ophthalmology', wait: 20, queue: 4, capacity: 22 },
    { name: 'Cardiology', wait: 50, queue: 11, capacity: 14 },
  ], distance: '5.7 km', address: '789 Max Lane, Medical Hub' },
];

const timeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

interface Booking {
  id: string;
  hospital_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  queue_position: number;
  estimated_wait: number;
  status: string;
  notes: string;
  created_at: string;
}

const HospitalQueue = () => {
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [liveQueues, setLiveQueues] = useState<Record<string, { wait: number; queue: number }>>({});
  const [bookingDept, setBookingDept] = useState<typeof hospitals[0]['departments'][0] | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate live queue fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveQueues(prev => {
        const updated = { ...prev };
        selectedHospital.departments.forEach(d => {
          const key = `${selectedHospital.id}-${d.name}`;
          const delta = Math.random() > 0.5 ? 1 : -1;
          const currentQueue = (updated[key]?.queue ?? d.queue) + delta;
          const currentWait = Math.max(5, (updated[key]?.wait ?? d.wait) + delta * 3);
          updated[key] = { queue: Math.max(0, currentQueue), wait: currentWait };
        });
        return updated;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [selectedHospital]);

  const getQueueData = (dept: typeof hospitals[0]['departments'][0]) => {
    const key = `${selectedHospital.id}-${dept.name}`;
    return liveQueues[key] || { wait: dept.wait, queue: dept.queue };
  };

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBookingsLoading(false); return; }
    const { data, error } = await supabase
      .from('hospital_queue_bookings' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });
    if (!error && data) setBookings(data as any as Booking[]);
    setBookingsLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings, refreshKey]);

  const handleBook = async () => {
    if (!bookingDept || !selectedDate || !selectedTime) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in to book a slot'); setLoading(false); return; }

      const queueData = getQueueData(bookingDept);
      const { error } = await supabase.from('hospital_queue_bookings' as any).insert({
        user_id: user.id,
        hospital_name: selectedHospital.name,
        department: bookingDept.name,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        queue_position: Math.max(1, Math.round(queueData.queue + 1)),
        estimated_wait: Math.max(0, Math.round(queueData.wait)),
        status: 'confirmed',
        notes,
      });
      if (error) throw error;
      setBookingStep(3);
      setRefreshKey(r => r + 1);
      toast.success(`Slot booked at ${selectedHospital.name} — ${bookingDept.name}`);
    } catch (err: any) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase
      .from('hospital_queue_bookings' as any)
      .update({ status: 'cancelled' } as any)
      .eq('id', id);
    if (error) { toast.error('Failed to cancel'); return; }
    toast.success('Booking cancelled');
    setRefreshKey(r => r + 1);
  };

  const resetBookingDialog = () => {
    setBookingDept(null);
    setBookingStep(1);
    setSelectedDate(undefined);
    setSelectedTime('');
    setNotes('');
  };

  const getWaitColor = (wait: number) => wait < 20 ? 'text-success' : wait < 40 ? 'text-warning' : 'text-destructive';
  const getLoadColor = (load: number) => load > 75 ? 'text-destructive' : load > 50 ? 'text-warning' : 'text-success';

  const upcoming = bookings.filter(b => b.status === 'confirmed' && isAfter(parseISO(b.appointment_date), new Date(Date.now() - 86400000)));
  const past = bookings.filter(b => b.status !== 'confirmed' || !isAfter(parseISO(b.appointment_date), new Date(Date.now() - 86400000)));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-10 text-primary-foreground">
        <div className="absolute -right-6 -bottom-6 md:right-6 md:bottom-4">
          <Building2 className="h-32 w-32 md:h-40 md:w-40 text-primary-foreground/10" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-primary-foreground/15 backdrop-blur-sm"><Building2 className="h-5 w-5" /></div>
            <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 backdrop-blur-sm text-xs">
              <Activity className="h-3 w-3 mr-1" /> Live Tracking
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight mb-2">Hospital Queue</h1>
          <p className="text-primary-foreground/70 text-sm">Real-time queue monitoring, smart slot booking, and live wait time estimates.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Hospitals', value: hospitals.length, icon: Building2, color: 'text-primary' },
          { label: 'Departments', value: hospitals.reduce((s, h) => s + h.departments.length, 0), icon: Activity, color: 'text-success' },
          { label: 'My Bookings', value: upcoming.length, icon: CalendarIcon, color: 'text-accent' },
          { label: 'Avg Wait', value: `${Math.round(selectedHospital.departments.reduce((s, d) => s + getQueueData(d).wait, 0) / selectedHospital.departments.length)}m`, icon: Clock, color: 'text-warning' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}>
            <Card className="rounded-2xl border-0 bg-card/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 p-2 rounded-xl bg-muted/50 w-fit"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                <p className="text-2xl font-heading font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="queues" className="space-y-4">
        <TabsList className="rounded-xl">
          <TabsTrigger value="queues" className="rounded-lg gap-1.5"><Activity className="h-3.5 w-3.5" /> Live Queues</TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-lg gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="queues" className="space-y-4">
          {/* Hospital Selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hospitals.map(h => (
              <Button key={h.id} size="sm" variant={selectedHospital.id === h.id ? 'default' : 'outline'} onClick={() => setSelectedHospital(h)} className="shrink-0 text-xs gap-1 rounded-xl">
                <MapPin className="h-3 w-3" /> {h.name} ({h.distance})
              </Button>
            ))}
          </div>

          {/* Address */}
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedHospital.address}</p>

          {/* Department Queues */}
          <div className="grid sm:grid-cols-2 gap-4">
            {selectedHospital.departments.map((d, i) => {
              const q = getQueueData(d);
              const load = (q.queue / d.capacity) * 100;
              return (
                <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="rounded-2xl border-border/40 hover:shadow-colored hover:border-primary/20 transition-all duration-300 group overflow-hidden">
                    <div className={`h-1 ${load > 75 ? 'bg-destructive' : load > 50 ? 'bg-warning' : 'bg-success'} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <CardContent className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-heading font-semibold text-sm">{d.name}</h4>
                        <Badge variant="outline" className={`text-xs rounded-lg ${getWaitColor(q.wait)}`}>
                          <Clock className="h-3 w-3 mr-1" /> ~{q.wait} min
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {q.queue} in queue</span>
                        <span>Capacity: {d.capacity}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Queue Load</span>
                          <span className={getLoadColor(load)}>{Math.round(load)}%</span>
                        </div>
                        <Progress value={Math.min(load, 100)} className={`h-2 ${load > 75 ? '[&>div]:bg-destructive' : load > 50 ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`} />
                      </div>
                      {load > 75 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-destructive bg-destructive/5 rounded-lg px-2 py-1">
                          <AlertTriangle className="h-3 w-3" /> High load — expect longer wait times
                        </div>
                      )}
                      <Button size="sm" className="w-full text-xs rounded-xl gap-1.5" onClick={() => setBookingDept(d)}>
                        <CalendarIcon className="h-3.5 w-3.5" /> Book Slot
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No bookings yet</p>
              <p className="text-xs text-muted-foreground/60">Book a slot from the Live Queues tab</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-primary">Upcoming</h3>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {upcoming.map((b, i) => (
                        <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <Card className="rounded-xl border-primary/20 bg-primary/5">
                            <CardContent className="p-4 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{b.hospital_name}</p>
                                <p className="text-[10px] text-muted-foreground">{b.department}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Badge variant="outline" className="text-[10px] rounded-lg gap-1"><CalendarIcon className="h-2.5 w-2.5" /> {format(parseISO(b.appointment_date), 'MMM d, yyyy')}</Badge>
                                  <Badge variant="outline" className="text-[10px] rounded-lg gap-1"><Clock className="h-2.5 w-2.5" /> {b.appointment_time}</Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Badge className="bg-success/10 text-success border-0 text-[10px] rounded-lg gap-1"><Users className="h-2.5 w-2.5" /> Position #{b.queue_position}</Badge>
                                  <span className="text-[10px] text-muted-foreground">~{b.estimated_wait} min wait</span>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => cancelBooking(b.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Past / Cancelled</h3>
                  <div className="space-y-2">
                    {past.map(b => (
                      <Card key={b.id} className="rounded-xl opacity-60">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm truncate">{b.hospital_name} · {b.department}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {format(parseISO(b.appointment_date), 'MMM d, yyyy')} · {b.appointment_time}
                              {b.status === 'cancelled' && <Badge variant="outline" className="ml-2 text-[9px] rounded-lg text-destructive">Cancelled</Badge>}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={!!bookingDept} onOpenChange={() => resetBookingDialog()}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {bookingDept && (
            <>
              <div className="h-16 bg-gradient-to-br from-primary to-accent relative flex items-center px-6">
                <div className="flex items-center gap-3 text-primary-foreground">
                  <Building2 className="h-5 w-5" />
                  <div>
                    <p className="font-heading font-bold text-sm">{selectedHospital.name}</p>
                    <p className="text-[10px] text-primary-foreground/70">{bookingDept.name}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-4 flex gap-1.5">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all ${bookingStep >= s ? 'w-6 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/30'}`} />
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <DialogHeader>
                  <DialogTitle className="font-heading text-lg">Book Slot — {bookingDept.name}</DialogTitle>
                  <DialogDescription className="text-xs">
                    Current wait: ~{getQueueData(bookingDept).wait} min · {getQueueData(bookingDept).queue} in queue
                  </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                  {bookingStep === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, startOfToday()) || isBefore(addDays(new Date(), 14), date)}
                        className="rounded-xl border border-border/50 mx-auto"
                      />
                      {selectedDate && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <p className="text-xs text-muted-foreground mb-2">Available slots for {format(selectedDate, 'MMM d, yyyy')}</p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {timeSlots.map(t => (
                              <Button key={t} size="sm" variant={selectedTime === t ? 'default' : 'outline'} className="text-[10px] h-8 rounded-lg" onClick={() => setSelectedTime(t)}>{t}</Button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Notes (optional)</p>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Reason for visit..." className="rounded-xl text-sm resize-none" rows={2} />
                      </div>
                      <Button className="w-full rounded-xl gap-2" disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)}>
                        Review Booking <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  {bookingStep === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-muted/40 rounded-xl p-4 space-y-2.5">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Hospital</span><span className="font-medium">{selectedHospital.name}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Department</span><span>{bookingDept.name}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMM d, yyyy')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime}</span></div>
                        <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-2">
                          <span className="text-muted-foreground">Est. Queue Position</span>
                          <span className="font-bold text-primary">#{getQueueData(bookingDept).queue + 1}</span>
                        </div>
                      </div>
                      {notes && <div className="bg-muted/30 rounded-xl p-3"><p className="text-[10px] text-muted-foreground mb-1">Your notes:</p><p className="text-xs">{notes}</p></div>}
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setBookingStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                        <Button className="flex-1 rounded-xl gap-2" onClick={handleBook} disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Confirm Booking
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
                      <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"><CheckCircle2 className="h-8 w-8 text-success" /></div>
                      <h3 className="font-heading text-lg font-bold">Slot Booked!</h3>
                      <p className="text-sm text-muted-foreground">
                        Your slot at <strong>{selectedHospital.name}</strong> — {bookingDept.name} is confirmed for{' '}
                        <strong>{selectedDate && format(selectedDate, 'MMM d')}</strong> at <strong>{selectedTime}</strong>.
                      </p>
                      <p className="text-xs text-muted-foreground">View and manage your bookings in the My Bookings tab.</p>
                      <Button className="rounded-xl" onClick={resetBookingDialog}>Done</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalQueue;
