import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Phone, MessageCircle, Calendar, Clock, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons: Record<string, typeof Video> = { video: Video, audio: Phone, chat: MessageCircle };

interface Booking {
  id: string;
  doctor_name: string;
  doctor_specialty: string;
  doctor_country: string;
  appointment_date: string;
  appointment_time: string;
  timezone: string;
  consultation_type: string;
  price: string;
  status: string;
  notes: string;
  created_at: string;
}

interface MyBookingsProps {
  refreshKey: number;
}

export const MyBookings = ({ refreshKey }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('telemedicine_bookings' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });

    if (!error && data) setBookings(data as any as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [refreshKey]);

  const cancelBooking = async (id: string) => {
    const { error } = await supabase
      .from('telemedicine_bookings' as any)
      .update({ status: 'cancelled' } as any)
      .eq('id', id);

    if (error) { toast.error('Failed to cancel'); return; }
    toast.success('Booking cancelled');
    fetchBookings();
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (bookings.length === 0) return (
    <div className="text-center py-12">
      <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
      <p className="text-muted-foreground text-sm">No bookings yet</p>
      <p className="text-xs text-muted-foreground/60">Book a specialist to get started</p>
    </div>
  );

  const upcoming = bookings.filter(b => b.status === 'confirmed' && isAfter(parseISO(b.appointment_date), new Date(Date.now() - 86400000)));
  const past = bookings.filter(b => b.status !== 'confirmed' || !isAfter(parseISO(b.appointment_date), new Date(Date.now() - 86400000)));

  return (
    <div className="space-y-4">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-primary">Upcoming</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {upcoming.map((b, i) => {
                const Icon = typeIcons[b.consultation_type] || Video;
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="rounded-xl border-primary/20 bg-primary/5">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{b.doctor_name}</p>
                            <p className="text-[10px] text-muted-foreground">{b.doctor_specialty} · {b.doctor_country}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] rounded-lg gap-1">
                                <Calendar className="h-2.5 w-2.5" /> {format(parseISO(b.appointment_date), 'MMM d')}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] rounded-lg gap-1">
                                <Clock className="h-2.5 w-2.5" /> {b.appointment_time}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => cancelBooking(b.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Past / Cancelled</h3>
          <div className="space-y-2">
            {past.map(b => {
              const Icon = typeIcons[b.consultation_type] || Video;
              return (
                <Card key={b.id} className="rounded-xl opacity-60">
                  <CardContent className="p-3 flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm truncate">{b.doctor_name} · {b.doctor_specialty}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(parseISO(b.appointment_date), 'MMM d, yyyy')} · {b.appointment_time}
                        {b.status === 'cancelled' && <Badge variant="outline" className="ml-2 text-[9px] rounded-lg text-destructive">Cancelled</Badge>}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
