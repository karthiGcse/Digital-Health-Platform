import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  Scan, Brain, Users, Globe, Dna, Watch, FlaskConical, Shield, Plane,
  Building2, RefreshCw, Globe2, Stethoscope, Apple, Dumbbell,
  HeartPulse, ShieldCheck, CircleDot, Ear, Wallet, FileText,
  Bell, MapPin, BarChart3, Sparkles, Zap, ArrowRight, Star,
  Layers, ChevronRight, Search
} from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    label: 'Core Health',
    desc: 'Essential daily health tools',
    icon: Activity,
    accent: 'bg-blue-500',
    accentLight: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    features: [
      { icon: Activity, title: 'Symptom Checker', desc: 'AI-powered symptom analysis', route: '/symptoms' },
      { icon: Pill, title: 'Medicine Lookup', desc: 'Drug info & alternatives', route: '/medicines' },
      { icon: AlertTriangle, title: 'Drug Interactions', desc: 'Safety conflict checker', route: '/interactions' },
      { icon: FileText, title: 'Prescriptions', desc: 'Upload & manage Rx', route: '/prescriptions' },
      { icon: Bell, title: 'Reminders', desc: 'Never miss a dose', route: '/reminders' },
      { icon: AlertCircle, title: 'Emergency', desc: 'Instant emergency help', route: '/emergency' },
    ],
  },
  {
    label: 'AI & Diagnostics',
    desc: 'Smart AI-powered insights',
    icon: Brain,
    accent: 'bg-violet-500',
    accentLight: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    features: [
      { icon: MessageSquare, title: 'AI Consultation', desc: '24/7 AI doctor chat', route: '/consultation' },
      { icon: Scan, title: 'Image Diagnosis', desc: 'Medical image AI', route: '/image-diagnosis' },
      { icon: Brain, title: 'Mental Health AI', desc: 'Emotional support', route: '/mental-health' },
      { icon: Stethoscope, title: 'AI Radiology', desc: 'CT, MRI & ultrasound', route: '/radiology' },
      { icon: BarChart3, title: 'Health Analytics', desc: 'Trends & insights', route: '/analytics' },
      { icon: FileText, title: 'AI Reports', desc: 'Auto-generated reports', route: '/reports' },
    ],
  },
  {
    label: 'Telehealth',
    desc: 'Connect with providers',
    icon: Globe2,
    accent: 'bg-cyan-500',
    accentLight: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    features: [
      { icon: Calendar, title: 'Telemedicine', desc: 'Video doctor visits', route: '/telemedicine' },
      { icon: Globe2, title: 'Global Telemedicine', desc: 'Worldwide specialists', route: '/global-telemedicine' },
      { icon: MapPin, title: 'Nearby Services', desc: 'Pharmacies & clinics', route: '/nearby' },
      { icon: Building2, title: 'Hospital Queue', desc: 'Real-time queue tracking', route: '/hospital-queue' },
      { icon: FlaskConical, title: 'Home Lab Booking', desc: 'Doorstep lab tests', route: '/lab-booking' },
      { icon: Plane, title: 'Drone Delivery', desc: 'Emergency med drones', route: '/drone-delivery' },
    ],
  },
  {
    label: 'Wellness',
    desc: 'Nutrition, fitness & lifestyle',
    icon: HeartPulse,
    accent: 'bg-emerald-500',
    accentLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    features: [
      { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans', route: '/nutrition' },
      { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient match', route: '/blood-donation' },
      { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart risk assessment', route: '/cardiac-risk' },
    ],
  },
  {
    label: 'Advanced & Genomics',
    desc: 'Cutting-edge health tech',
    icon: Dna,
    accent: 'bg-pink-500',
    accentLight: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    features: [
      { icon: Dna, title: 'Genetic Profiling', desc: 'DNA-based health insights', route: '/genetic-profiling' },
      { icon: Dna, title: 'Epigenetics', desc: 'Gene expression tracking', route: '/epigenetics' },
      { icon: Watch, title: 'Wearable Integration', desc: 'Sync fitness trackers', route: '/wearables' },
      { icon: Shield, title: 'Blockchain Records', desc: 'Tamper-proof health data', route: '/blockchain-records' },
      { icon: Ear, title: 'Hearing Health', desc: 'Early hearing detection', route: '/hearing-health' },
      { icon: Users, title: 'Family Health Hub', desc: 'Family health manager', route: '/family-health' },
    ],
  },
  {
    label: 'Finance & Tools',
    desc: 'Health finance & automation',
    icon: Wallet,
    accent: 'bg-amber-500',
    accentLight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    features: [
      { icon: ShieldCheck, title: 'Insurance Optimizer', desc: 'AI insurance comparison', route: '/insurance' },
      { icon: Wallet, title: 'Health Wallet', desc: 'Unified health payments', route: '/health-wallet' },
      { icon: RefreshCw, title: 'Auto Refill', desc: 'Auto medication refills', route: '/auto-refill' },
      { icon: Globe, title: 'Voice Assistant', desc: 'Multilingual health AI', route: '/voice-assistant' },
    ],
  },
];

const totalFeatures = categories.reduce((sum, c) => sum + c.features.length, 0);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const ComingSoon = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    features: cat.features.filter(f =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.features.length > 0);

  return (
    <div className="space-y-8 pb-8">
      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-7 md:p-10"
        style={{
          background: 'linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(230, 50%, 15%) 50%, hsl(260, 40%, 18%) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/8 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <Badge className="bg-white/8 text-white/60 border-white/10 text-[10px] font-medium mb-4 backdrop-blur-sm">
              <Layers className="h-3 w-3 mr-1" /> S47 Health Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight"
          >
            Unified Health Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-white/40 text-sm max-w-lg"
          >
            {totalFeatures} features across {categories.length} categories — your complete health ecosystem.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 mt-6"
          >
            {[
              { value: totalFeatures, label: 'Features' },
              { value: categories.length, label: 'Categories' },
              { value: '100%', label: 'Live' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-heading font-extrabold text-white">{s.value}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-semibold">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ SEARCH ═══ */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search features..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
      </div>

      {/* ═══ CATEGORIES ═══ */}
      {filteredCategories.map((category) => (
        <motion.div
          key={category.label}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={containerVariants}
          className="space-y-3"
        >
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3"
          >
            <div className={`h-2 w-2 rounded-full ${category.accent}`} />
            <h2 className="text-base font-heading font-bold text-foreground">{category.label}</h2>
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] text-muted-foreground font-medium">{category.features.length}</span>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
            {category.features.map((feature) => (
              <motion.div key={feature.route} variants={itemVariants}>
                <Card
                  className="group cursor-pointer h-full border-border/50 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent className="p-3.5 flex flex-col items-center text-center gap-2.5 h-full justify-center">
                    <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
                      <feature.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground leading-tight">{feature.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{feature.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Open <ChevronRight className="h-2.5 w-2.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* ═══ FOOTER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(230, 50%, 15%) 50%, hsl(260, 40%, 18%) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <Sparkles className="h-6 w-6 text-amber-400/70 mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white">
            Your Health, Powered by AI
          </h3>
          <p className="text-white/35 text-sm mt-2 max-w-md mx-auto">
            All {totalFeatures} features are live. Click any module above to get started.
          </p>
          <Button
            className="mt-5 bg-white/10 hover:bg-white/20 text-white border border-white/10 gap-1.5"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
