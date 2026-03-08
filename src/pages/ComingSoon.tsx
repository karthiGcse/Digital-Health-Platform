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
  Bell, MapPin, BarChart3, Sparkles, ArrowRight,
  Layers, ChevronRight, Search, Heart, Zap
} from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    label: 'Core Health',
    desc: 'Essential daily health tools',
    icon: Heart,
    gradient: 'from-blue-500 to-cyan-400',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    cardAccent: 'group-hover:border-blue-400/40 group-hover:shadow-blue-500/10',
    iconHover: 'group-hover:from-blue-500/20 group-hover:to-cyan-400/20',
    textHover: 'group-hover:text-blue-500',
    features: [
      { icon: Activity, title: 'Symptom Checker', desc: 'AI-powered symptom analysis', route: '/symptoms', color: 'from-blue-500 to-blue-600' },
      { icon: Pill, title: 'Medicine Lookup', desc: 'Drug info & alternatives', route: '/medicines', color: 'from-cyan-500 to-blue-500' },
      { icon: AlertTriangle, title: 'Drug Interactions', desc: 'Safety conflict checker', route: '/interactions', color: 'from-amber-500 to-orange-500' },
      { icon: FileText, title: 'Prescriptions', desc: 'Upload & manage Rx', route: '/prescriptions', color: 'from-violet-500 to-blue-500' },
      { icon: Bell, title: 'Reminders', desc: 'Never miss a dose', route: '/reminders', color: 'from-sky-500 to-blue-500' },
      { icon: AlertCircle, title: 'Emergency', desc: 'Instant emergency help', route: '/emergency', color: 'from-red-500 to-rose-500' },
    ],
  },
  {
    label: 'AI & Diagnostics',
    desc: 'Smart AI-powered insights',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-500',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
    cardAccent: 'group-hover:border-violet-400/40 group-hover:shadow-violet-500/10',
    iconHover: 'group-hover:from-violet-500/20 group-hover:to-purple-500/20',
    textHover: 'group-hover:text-violet-500',
    features: [
      { icon: MessageSquare, title: 'AI Consultation', desc: '24/7 AI doctor chat', route: '/consultation', color: 'from-violet-500 to-purple-500' },
      { icon: Scan, title: 'Image Diagnosis', desc: 'Medical image AI', route: '/image-diagnosis', color: 'from-indigo-500 to-violet-500' },
      { icon: Brain, title: 'Mental Health AI', desc: 'Emotional support', route: '/mental-health', color: 'from-pink-500 to-violet-500' },
      { icon: Stethoscope, title: 'AI Radiology', desc: 'CT, MRI & ultrasound', route: '/radiology', color: 'from-blue-500 to-violet-500' },
      { icon: BarChart3, title: 'Health Analytics', desc: 'Trends & insights', route: '/analytics', color: 'from-emerald-500 to-cyan-500' },
      { icon: FileText, title: 'AI Reports', desc: 'Auto-generated reports', route: '/reports', color: 'from-amber-500 to-pink-500' },
    ],
  },
  {
    label: 'Telehealth',
    desc: 'Connect with providers',
    icon: Globe2,
    gradient: 'from-cyan-500 to-teal-400',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-400',
    cardAccent: 'group-hover:border-cyan-400/40 group-hover:shadow-cyan-500/10',
    iconHover: 'group-hover:from-cyan-500/20 group-hover:to-teal-400/20',
    textHover: 'group-hover:text-cyan-500',
    features: [
      { icon: Calendar, title: 'Telemedicine', desc: 'Video doctor visits', route: '/telemedicine', color: 'from-blue-500 to-violet-500' },
      { icon: Globe2, title: 'Global Telemedicine', desc: 'Worldwide specialists', route: '/global-telemedicine', color: 'from-cyan-500 to-blue-500' },
      { icon: MapPin, title: 'Nearby Services', desc: 'Pharmacies & clinics', route: '/nearby', color: 'from-orange-500 to-red-500' },
      { icon: Building2, title: 'Hospital Queue', desc: 'Real-time queue tracking', route: '/hospital-queue', color: 'from-teal-500 to-cyan-500' },
      { icon: FlaskConical, title: 'Home Lab Booking', desc: 'Doorstep lab tests', route: '/lab-booking', color: 'from-emerald-500 to-teal-500' },
      { icon: Plane, title: 'Drone Delivery', desc: 'Emergency med drones', route: '/drone-delivery', color: 'from-orange-500 to-amber-500' },
    ],
  },
  {
    label: 'Wellness',
    desc: 'Nutrition, fitness & lifestyle',
    icon: HeartPulse,
    gradient: 'from-emerald-500 to-green-400',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-400',
    cardAccent: 'group-hover:border-emerald-400/40 group-hover:shadow-emerald-500/10',
    iconHover: 'group-hover:from-emerald-500/20 group-hover:to-green-400/20',
    textHover: 'group-hover:text-emerald-500',
    features: [
      { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans', route: '/nutrition', color: 'from-emerald-500 to-green-500' },
      { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient match', route: '/blood-donation', color: 'from-red-500 to-pink-500' },
      { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart risk assessment', route: '/cardiac-risk', color: 'from-rose-500 to-red-500' },
    ],
  },
  {
    label: 'Advanced & Genomics',
    desc: 'Cutting-edge health tech',
    icon: Dna,
    gradient: 'from-pink-500 to-rose-400',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-400',
    cardAccent: 'group-hover:border-pink-400/40 group-hover:shadow-pink-500/10',
    iconHover: 'group-hover:from-pink-500/20 group-hover:to-rose-400/20',
    textHover: 'group-hover:text-pink-500',
    features: [
      { icon: Dna, title: 'Genetic Profiling', desc: 'DNA-based health insights', route: '/genetic-profiling', color: 'from-purple-500 to-pink-500' },
      { icon: Dna, title: 'Epigenetics', desc: 'Gene expression tracking', route: '/epigenetics', color: 'from-violet-500 to-indigo-500' },
      { icon: Watch, title: 'Wearable Integration', desc: 'Sync fitness trackers', route: '/wearables', color: 'from-sky-500 to-blue-500' },
      { icon: Shield, title: 'Blockchain Records', desc: 'Tamper-proof health data', route: '/blockchain-records', color: 'from-red-500 to-orange-500' },
      { icon: Ear, title: 'Hearing Health', desc: 'Early hearing detection', route: '/hearing-health', color: 'from-amber-500 to-emerald-500' },
      { icon: Users, title: 'Family Health Hub', desc: 'Family health manager', route: '/family-health', color: 'from-orange-500 to-pink-500' },
    ],
  },
  {
    label: 'Finance & Tools',
    desc: 'Health finance & automation',
    icon: Wallet,
    gradient: 'from-amber-500 to-orange-400',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-400',
    cardAccent: 'group-hover:border-amber-400/40 group-hover:shadow-amber-500/10',
    iconHover: 'group-hover:from-amber-500/20 group-hover:to-orange-400/20',
    textHover: 'group-hover:text-amber-500',
    features: [
      { icon: ShieldCheck, title: 'Insurance Optimizer', desc: 'AI insurance comparison', route: '/insurance', color: 'from-blue-500 to-violet-500' },
      { icon: Wallet, title: 'Health Wallet', desc: 'Unified health payments', route: '/health-wallet', color: 'from-amber-500 to-orange-500' },
      { icon: RefreshCw, title: 'Auto Refill', desc: 'Auto medication refills', route: '/auto-refill', color: 'from-emerald-500 to-teal-500' },
      { icon: Globe, title: 'Voice Assistant', desc: 'Multilingual health AI', route: '/voice-assistant', color: 'from-indigo-500 to-cyan-500' },
    ],
  },
];

const totalFeatures = categories.reduce((sum, c) => sum + c.features.length, 0);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
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
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e3a5f 100%)',
        }}
      >
        {/* Animated orbs */}
        <motion.div
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-50px] right-[-30px] w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [10, -10, 10], x: [5, -8, 5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-60px] left-[-20px] w-[250px] h-[250px] rounded-full blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-[180px] h-[180px] rounded-full blur-[70px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.1] backdrop-blur-md rounded-full px-4 py-1.5 mb-5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/60 text-[11px] font-semibold tracking-wide">All Systems Live</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-[1.1] tracking-tight"
          >
            Unified Health
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-white/40 text-sm md:text-base max-w-lg leading-relaxed"
          >
            {totalFeatures} powerful features across {categories.length} categories — your complete health ecosystem.
          </motion.p>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 mt-7"
          >
            {[
              { value: totalFeatures, label: 'Features', icon: Zap, gradient: 'from-cyan-400 to-blue-500' },
              { value: categories.length, label: 'Categories', icon: Layers, gradient: 'from-violet-400 to-purple-500' },
              { value: '100%', label: 'Live', icon: Sparkles, gradient: 'from-amber-400 to-orange-500' },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-2.5 cursor-default"
              >
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                  <s.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ SEARCH ═══ */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search features..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
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
          className="space-y-4"
        >
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`h-9 w-9 rounded-xl ${category.iconBg} flex items-center justify-center shadow-lg`}>
              <category.icon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-heading font-bold text-foreground">{category.label}</h2>
              <p className="text-[11px] text-muted-foreground">{category.desc}</p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-bold px-2.5">
              {category.features.length}
            </Badge>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {category.features.map((feature) => (
              <motion.div key={feature.route} variants={itemVariants}>
                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}>
                  <Card
                    className={`group cursor-pointer h-full border-border/50 hover:shadow-xl ${category.cardAccent} transition-all duration-300 overflow-hidden`}
                    onClick={() => navigate(feature.route)}
                  >
                    {/* Top gradient line */}
                    <div className={`h-1 w-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full justify-center">
                      {/* Gradient icon */}
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <feature.icon className="h-5 w-5 text-white drop-shadow-sm" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground leading-tight">{feature.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{feature.desc}</p>
                      </div>
                      {/* Hover CTA */}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* ═══ FOOTER CTA ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e3a5f 100%)',
        }}
      >
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-48 h-48 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-[70px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)' }}
        />
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-4"
          >
            <Sparkles className="h-8 w-8 text-amber-400" />
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white leading-tight">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h3>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
            All {totalFeatures} features are live and ready. Click any module to get started.
          </p>
          <Button
            className="mt-6 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white border-0 gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
