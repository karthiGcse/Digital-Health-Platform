import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Video, Phone, MessageCircle, Clock, CalendarIcon, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, isBefore, startOfToday } from 'date-fns';

type Specialist = {
  id: number;
  name: string;
  specialty: string;
  country: string;
  languages: string[];
  rating: number;
  reviews: number;
  price: string;
  available: string;
  timezone: string;
  bio: string;
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

const consultationTypes = [
  { id: 'video', label: 'Video Call', icon: Video, desc: 'Face-to-face HD video consultation' },
  { id: 'audio', label: 'Voice Call', icon: Phone, desc: 'Audio-only consultation' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, desc: 'Text-based consultation' },
];

interface BookingDialogProps {
  doctor: Specialist | null;
  open: boolean;
  onClose: () => void;
  gradientClass: string;
  onBooked: () => void;
}

export const BookingDialog = ({ doctor, open, onClose, gradientClass, onBooked }: BookingDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [consultType, setConsultType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime('');
    setConsultType('video');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBook = async () => {
    if (!doctor || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to book an appointment');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('telemedicine_bookings' as any).insert({
        user_id: user.id,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        doctor_country: doctor.country,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        timezone: doctor.timezone,
        consultation_type: consultType,
        price: doctor.price,
        notes,
        status: 'confirmed',
      });

      if (error) throw error;

      setStep(4); // success step
      onBooked();
      toast.success(`Appointment booked with ${doctor.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  const initials = doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`h-20 bg-gradient-to-br ${gradientClass} relative`}>
          <div className="absolute -bottom-7 left-6">
            <div className="h-14 w-14 rounded-2xl bg-card shadow-lg flex items-center justify-center text-base font-bold text-primary border-4 border-card">
              {initials}
            </div>
          </div>
          {/* Step indicator */}
          <div className="absolute top-3 right-4 flex gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${step >= s ? 'w-6 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/30'}`} />
            ))}
          </div>
        </div>

        <div className="px-6 pt-9 pb-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">{doctor.name}</DialogTitle>
            <DialogDescription className="text-xs">
              {doctor.specialty} · {doctor.country} · {doctor.price}/session
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" /> Select Date & Time
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, startOfToday()) || isBefore(addDays(new Date(), 30), date)}
                  className="rounded-xl border border-border/50 mx-auto"
                />
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs text-muted-foreground mb-2">Available slots for {format(selectedDate, 'MMM d, yyyy')} ({doctor.timezone})</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeSlots.map(t => (
                        <Button
                          key={t}
                          size="sm"
                          variant={selectedTime === t ? 'default' : 'outline'}
                          className="text-[10px] h-8 rounded-lg"
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                <Button
                  className="w-full rounded-xl gap-2"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Consultation Type & Notes */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-sm font-semibold">Consultation Type</h3>
                <div className="grid gap-2">
                  {consultationTypes.map(ct => (
                    <div
                      key={ct.id}
                      onClick={() => setConsultType(ct.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${consultType === ct.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'}`}
                    >
                      <div className={`p-2 rounded-lg ${consultType === ct.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <ct.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ct.label}</p>
                        <p className="text-[10px] text-muted-foreground">{ct.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Notes for the doctor (optional)</p>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Describe your symptoms or reason for visit..."
                    className="rounded-xl text-sm resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl gap-2" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="flex-1 rounded-xl gap-2" onClick={() => setStep(3)}>
                    Review Booking <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-sm font-semibold">Review Your Booking</h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Specialty</span>
                    <span>{doctor.specialty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{selectedTime} ({doctor.timezone})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="outline" className="text-xs rounded-lg">{consultationTypes.find(c => c.id === consultType)?.label}</Badge>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-lg font-heading font-bold text-primary">{doctor.price}</span>
                  </div>
                </div>
                {notes && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Your notes:</p>
                    <p className="text-xs">{notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl gap-2" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="flex-1 rounded-xl gap-2" onClick={handleBook} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-heading text-lg font-bold">Booking Confirmed!</h3>
                <p className="text-sm text-muted-foreground">
                  Your {consultationTypes.find(c => c.id === consultType)?.label.toLowerCase()} with <strong>{doctor.name}</strong> is scheduled for{' '}
                  <strong>{selectedDate && format(selectedDate, 'MMM d')}</strong> at <strong>{selectedTime}</strong> ({doctor.timezone}).
                </p>
                <p className="text-xs text-muted-foreground">A confirmation has been saved. You can view it in My Bookings.</p>
                <Button className="rounded-xl" onClick={handleClose}>Done</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
