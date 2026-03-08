import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, Trophy, CheckCircle2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  // Launched features
  { id: '1', icon: '🧬', title: 'AI Genetic Health Profiling', tag: 'AI', eta: 'Launched ✅', progress: 100, desc: 'Personalized health insights based on genetic markers.', benefits: ['Tailored medication recommendations', 'Genetic risk assessment', 'Family health tree analysis'], launched: true, route: '/genetic-profiling' },
  { id: '2', icon: '⌚', title: 'Wearable Device Integration', tag: 'IoT', eta: 'Launched ✅', progress: 100, desc: 'Connect your fitness trackers and smartwatches.', benefits: ['Real-time vitals monitoring', 'Automatic health data sync', 'Smart alerts for anomalies'], launched: true, route: '/wearables' },
  { id: '3', icon: '🤖', title: 'AI Image Diagnosis', tag: 'AI Vision', eta: 'Launched ✅', progress: 100, desc: 'Upload medical images for AI-powered analysis.', benefits: ['Skin condition detection', 'X-ray preliminary analysis', 'Eye health screening'], launched: true, route: '/image-diagnosis' },
  { id: '4', icon: '🏠', title: 'Home Lab Test Booking', tag: 'Service', eta: 'Launched ✅', progress: 100, desc: 'Book lab tests from home with doorstep sample collection.', benefits: ['Doorstep sample collection', 'Digital reports in 24hrs', 'Insurance integration'], launched: true, route: '/lab-booking' },
  { id: '5', icon: '💬', title: 'Multilingual Voice Assistant', tag: 'Voice', eta: 'Launched ✅', progress: 100, desc: 'Talk to your health assistant in your language.', benefits: ['10+ language support', 'Voice-based interactions', 'Text-to-speech responses'], launched: true, route: '/voice-assistant' },
  { id: '6', icon: '🔒', title: 'Blockchain Health Records', tag: 'Security', eta: 'Launched ✅', progress: 100, desc: 'Secure, tamper-proof medical records on blockchain.', benefits: ['Immutable records', 'Cross-hospital portability', 'Patient-controlled access'], launched: true, route: '/blockchain-records' },
  { id: '7', icon: '🚁', title: 'Drone Medicine Delivery', tag: 'Logistics', eta: 'Launched ✅', progress: 100, desc: 'Emergency medicine delivery via autonomous drones.', benefits: ['30-minute delivery', 'Rural area coverage', 'Temperature-controlled cargo'], launched: true, route: '/drone-delivery' },
  { id: '8', icon: '🧠', title: 'Mental Health AI Companion', tag: 'Wellness', eta: 'Launched ✅', progress: 100, desc: 'AI-powered mental health support and therapy.', benefits: ['24/7 emotional support', 'CBT-based exercises', 'Mood tracking & insights'], launched: true, route: '/mental-health' },
  { id: '9', icon: '👨‍👩‍👧', title: 'Family Health Hub', tag: 'Family', eta: 'Launched ✅', progress: 100, desc: 'Manage your family\'s health in one place.', benefits: ['Child vaccination tracker', 'Elder care monitoring', 'Shared prescriptions'], launched: true, route: '/family-health' },
  { id: '10', icon: '🏥', title: 'Hospital Queue Management', tag: 'Efficiency', eta: 'Launched ✅', progress: 100, desc: 'Real-time hospital queue tracking and booking.', benefits: ['Live wait times', 'Smart slot booking', 'Queue position alerts'], launched: true, route: '/hospital-queue' },
  { id: '11', icon: '💊', title: 'Auto Refill & Subscription', tag: 'Pharmacy', eta: 'Launched ✅', progress: 100, desc: 'Automatic medication refills on schedule.', benefits: ['Never miss a refill', 'Cost savings on bulk', 'Pharmacy comparison'], launched: true, route: '/auto-refill' },
  { id: '12', icon: '🌍', title: 'Global Telemedicine Network', tag: 'Global', eta: 'Launched ✅', progress: 100, desc: 'Connect with doctors worldwide for specialist consultations.', benefits: ['Access to global specialists', 'Multi-timezone scheduling', 'Translation support'], launched: true, route: '/global-telemedicine' },

  // Upcoming features
  { id: '13', icon: '🩻', title: 'AI Radiology Assistant', tag: 'AI Vision', eta: 'Q3 2026', progress: 72, desc: 'Advanced AI analysis of CT scans, MRIs, and ultrasounds.', benefits: ['3D scan visualization', 'Anomaly detection & highlighting', 'Radiologist second opinion'], launched: false },
  { id: '14', icon: '💉', title: 'Smart Vaccination Scheduler', tag: 'Service', eta: 'Q3 2026', progress: 65, desc: 'Automated vaccination scheduling for all age groups.', benefits: ['Age-based vaccine calendar', 'Booster dose reminders', 'Travel vaccine advisor'], launched: false },
  { id: '15', icon: '🍎', title: 'AI Nutrition & Diet Planner', tag: 'Wellness', eta: 'Q4 2026', progress: 48, desc: 'Personalized meal plans based on health conditions.', benefits: ['Condition-specific diets', 'Calorie & macro tracking', 'Grocery list generator'], launched: false },
  { id: '16', icon: '🏋️', title: 'Physiotherapy & Rehab Coach', tag: 'Fitness', eta: 'Q4 2026', progress: 40, desc: 'AI-guided exercise programs for injury recovery.', benefits: ['Video exercise demos', 'Progress tracking', 'Pain level monitoring'], launched: false },
  { id: '17', icon: '🔬', title: 'Clinical Trial Matcher', tag: 'Research', eta: 'Q1 2027', progress: 30, desc: 'Match patients with relevant clinical trials worldwide.', benefits: ['Eligibility screening', 'Trial location finder', 'Enrollment assistance'], launched: false },
  { id: '18', icon: '🧪', title: 'AI Pathology Report Analyzer', tag: 'AI', eta: 'Q1 2027', progress: 25, desc: 'Automated analysis and simplification of lab reports.', benefits: ['Plain-language summaries', 'Trend analysis over time', 'Abnormal value alerts'], launched: false },
  { id: '19', icon: '🫀', title: 'Cardiac Risk Predictor', tag: 'AI', eta: 'Q2 2027', progress: 18, desc: 'AI-powered heart disease risk assessment and monitoring.', benefits: ['10-year risk scoring', 'Lifestyle recommendations', 'ECG pattern analysis'], launched: false },
  { id: '20', icon: '👶', title: 'Maternal & Child Health Tracker', tag: 'Family', eta: 'Q2 2027', progress: 15, desc: 'Pregnancy monitoring and baby milestone tracking.', benefits: ['Week-by-week pregnancy guide', 'Growth chart tracking', 'Pediatric symptom checker'], launched: false },
  { id: '21', icon: '🦷', title: 'Dental Health AI Scanner', tag: 'AI Vision', eta: 'Q3 2027', progress: 10, desc: 'Scan teeth and gums for early detection of dental issues.', benefits: ['Cavity risk detection', 'Gum disease screening', 'Dental appointment booking'], launched: false },
  { id: '22', icon: '🛡️', title: 'Health Insurance Optimizer', tag: 'Finance', eta: 'Q3 2027', progress: 8, desc: 'AI-powered insurance plan comparison and claim assistance.', benefits: ['Plan comparison tool', 'Claim auto-filing', 'Coverage gap analysis'], launched: false },
];

const tagColors: Record<string, string> = {
  AI: 'bg-blue-500/10 text-blue-600', IoT: 'bg-green-500/10 text-green-600',
  'AI Vision': 'bg-purple-500/10 text-purple-600', Service: 'bg-amber-500/10 text-amber-600',
  Voice: 'bg-indigo-500/10 text-indigo-600', Security: 'bg-red-500/10 text-red-600',
  Logistics: 'bg-cyan-500/10 text-cyan-600', Wellness: 'bg-pink-500/10 text-pink-600',
  Family: 'bg-orange-500/10 text-orange-600', Efficiency: 'bg-teal-500/10 text-teal-600',
  Pharmacy: 'bg-emerald-500/10 text-emerald-600', Global: 'bg-sky-500/10 text-sky-600',
  Fitness: 'bg-lime-500/10 text-lime-600', Research: 'bg-violet-500/10 text-violet-600',
  Finance: 'bg-yellow-500/10 text-yellow-600',
};

const ComingSoon = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    features.forEach(f => { initial[f.id] = f.launched ? Math.floor(Math.random() * 200) + 300 : Math.floor(Math.random() * 200) + 50; });
    return initial;
  });
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const handleVote = (id: string) => {
    if (voted.has(id)) return;
    setVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVoted(prev => new Set(prev).add(id));
  };

  const sortedByVotes = [...features].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));
  const topThreeIds = new Set(sortedByVotes.slice(0, 3).map(f => f.id));
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const launchedCount = features.filter(f => f.launched).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary to-indigo-600 p-6 md:p-8 text-primary-foreground">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Help Shape the Future of S47 Health</h2>
          <p className="mt-1 text-primary-foreground/80 text-sm">Vote for features you want to see next. Your voice matters!</p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalVotes}</p>
              <p className="text-xs text-primary-foreground/70">Total Votes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{features.length}</p>
              <p className="text-xs text-primary-foreground/70">Features</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-300">{launchedCount}</p>
              <p className="text-xs text-primary-foreground/70">Launched</p>
            </div>
          </div>
        </div>
        <Rocket className="absolute top-4 right-6 h-16 w-16 text-white/10" />
      </div>

      {/* Roadmap strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map((q, i) => (
          <div key={q} className="flex items-center gap-2 shrink-0">
            <div className={`h-3 w-3 rounded-full ${i < 2 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <span className={`text-xs font-medium ${i < 2 ? 'text-primary' : 'text-muted-foreground'}`}>{q}</span>
            {i < 5 && <div className="w-8 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(f => (
          <Card key={f.id} className={`rounded-card shadow-sm hover:shadow-md transition-shadow relative ${f.launched ? 'border-success/30 bg-success/[0.02]' : ''}`}>
            {topThreeIds.has(f.id) && !f.launched && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-amber-500 text-white border-0 gap-1"><Trophy className="h-3 w-3" /> Most Voted</Badge>
              </div>
            )}
            {f.launched && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-success text-success-foreground border-0 gap-1"><CheckCircle2 className="h-3 w-3" /> Live</Badge>
              </div>
            )}
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{f.icon}</span>
                <Badge className={`text-[10px] border-0 ${tagColors[f.tag] || 'bg-muted text-muted-foreground'}`}>{f.tag}</Badge>
              </div>
              <h3 className="font-heading font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
              <ul className="space-y-1">
                {f.benefits.map((b, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <div className={`h-1 w-1 rounded-full ${f.launched ? 'bg-success' : 'bg-primary'} shrink-0`} /> {b}
                  </li>
                ))}
              </ul>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`${f.launched ? 'text-success font-medium' : 'text-muted-foreground'}`}>{f.eta}</span>
                  <span className="font-medium">{f.progress}%</span>
                </div>
                <Progress value={f.progress} className={`h-1.5 ${f.launched ? '[&>div]:bg-success' : ''}`} />
              </div>
              {f.launched ? (
                <Button size="sm" className="w-full text-xs gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => navigate(f.route!)}>
                  <ExternalLink className="h-3 w-3" /> Open Feature
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={voted.has(f.id) ? 'secondary' : 'outline'}
                  className="w-full text-xs"
                  onClick={() => handleVote(f.id)}
                  disabled={voted.has(f.id)}
                >
                  {voted.has(f.id) ? '✓ Voted' : '👍 Vote'} ({votes[f.id]})
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
