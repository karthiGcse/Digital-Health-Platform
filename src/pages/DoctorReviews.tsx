import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Clock, MapPin, MessageSquare } from 'lucide-react';

const doctors = [
  { name: 'Dr. Arun Sharma', specialty: 'Cardiologist', rating: 4.8, reviews: 342, waitTime: '15 min', location: 'Apollo Hospital', verified: true },
  { name: 'Dr. Priya Nair', specialty: 'Dermatologist', rating: 4.6, reviews: 218, waitTime: '20 min', location: 'Max Healthcare', verified: true },
  { name: 'Dr. Rajesh Kumar', specialty: 'Orthopedic', rating: 4.9, reviews: 156, waitTime: '10 min', location: 'Fortis Hospital', verified: true },
  { name: 'Dr. Meera Patel', specialty: 'Pediatrician', rating: 4.7, reviews: 289, waitTime: '25 min', location: 'City General', verified: false },
];

const DoctorReviews = () => (
  <div className="space-y-6">
    <div className="page-header gradient-success animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Star className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Doctor Reviews</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Doctor Rating & Reviews</h1>
        <p className="mt-1 text-white/75 text-sm">Rate and review doctors with verified patient feedback.</p>
      </div>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Top Rated Doctors</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.map((d, i) => (
            <div key={i} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{d.name}</h4>
                    {d.verified && <Badge className="bg-success/10 text-success border-0 text-[10px]">Verified</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{d.specialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-sm font-bold text-primary">{d.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span><MessageSquare className="h-3 w-3 inline" /> {d.reviews} reviews</span>
                <span><Clock className="h-3 w-3 inline" /> ~{d.waitTime} wait</span>
                <span><MapPin className="h-3 w-3 inline" /> {d.location}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">View Reviews</Button>
                <Button size="sm" className="flex-1">Book Appointment</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DoctorReviews;
