import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  Scan, Brain, Users, Globe, Dna, Watch, FlaskConical, Shield, Plane,
  Building2, RefreshCw, Globe2, Stethoscope, Syringe, Apple, Dumbbell,
  HeartPulse, ShieldCheck, CircleDot, Move3D, Ear, Wallet, FileText,
  Bell, MapPin, BarChart3, Sparkles, Zap, ArrowRight, Star
} from 'lucide-react';

const categoryGradients = [
  'from-blue-500 via-cyan-500 to-teal-400',
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-sky-400 via-blue-500 to-indigo-500',
  'from-emerald-400 via-green-500 to-teal-500',
  'from-pink-500 via-rose-500 to-red-400',
  'from-amber-400 via-orange-500 to-red-400',
];

const categoryEmojis = ['💊', '🤖', '🏥', '🧘', '🧬', '💰'];

const categories = [
  {
    label: 'Core Health Tools',
    color: 'hsl(var(--primary))',
    emoji: '💊',
    features: [
      { icon: Activity, title: 'Symptom Checker', desc: 'AI-powered symptom analysis', route: '/symptoms', from: '#3B82F6', to: '#06B6D4' },
      { icon: Pill, title: 'Medicine Lookup', desc: 'Drug info & alternatives', route: '/medicines', from: '#10B981', to: '#14B8A6' },
      { icon: AlertTriangle, title: 'Drug Interactions', desc: 'Safety conflict checker', route: '/interactions', from: '#F59E0B', to: '#EF4444' },
      { icon: FileText, title: 'Prescriptions', desc: 'Upload & manage Rx', route: '/prescriptions', from: '#8B5CF6', to: '#6366F1' },
      { icon: Bell, title: 'Reminders', desc: 'Never miss a dose', route: '/reminders', from: '#0EA5E9', to: '#3B82F6' },
      { icon: AlertCircle, title: 'Emergency', desc: 'Instant emergency help', route: '/emergency', from: '#EF4444', to: '#DC2626' },
    ],
  },
  {
    label: 'AI & Diagnostics',
    color: 'hsl(var(--accent))',
    emoji: '🤖',
    features: [
      { icon: MessageSquare, title: 'AI Consultation', desc: '24/7 AI doctor chat', route: '/consultation', from: '#8B5CF6', to: '#A855F7' },
      { icon: Scan, title: 'Image Diagnosis', desc: 'Medical image AI analysis', route: '/image-diagnosis', from: '#6366F1', to: '#8B5CF6' },
      { icon: Brain, title: 'Mental Health AI', desc: 'Emotional support & therapy', route: '/mental-health', from: '#EC4899', to: '#8B5CF6' },
      { icon: Stethoscope, title: 'AI Radiology', desc: 'CT, MRI & ultrasound AI', route: '/radiology', from: '#0EA5E9', to: '#6366F1' },
      { icon: BarChart3, title: 'Health Analytics', desc: 'Trends & insights', route: '/analytics', from: '#10B981', to: '#0EA5E9' },
      { icon: FileText, title: 'AI Reports', desc: 'Auto-generated reports', route: '/reports', from: '#F59E0B', to: '#EC4899' },
    ],
  },
  {
    label: 'Telehealth & Services',
    color: 'hsl(var(--info))',
    emoji: '🏥',
    features: [
      { icon: Calendar, title: 'Telemedicine', desc: 'Video doctor visits', route: '/telemedicine', from: '#3B82F6', to: '#8B5CF6' },
      { icon: Globe2, title: 'Global Telemedicine', desc: 'Worldwide specialists', route: '/global-telemedicine', from: '#0EA5E9', to: '#3B82F6' },
      { icon: MapPin, title: 'Nearby Services', desc: 'Pharmacies & clinics', route: '/nearby', from: '#F59E0B', to: '#EF4444' },
      { icon: Building2, title: 'Hospital Queue', desc: 'Real-time queue tracking', route: '/hospital-queue', from: '#06B6D4', to: '#3B82F6' },
      { icon: FlaskConical, title: 'Home Lab Booking', desc: 'Doorstep lab tests', route: '/lab-booking', from: '#10B981', to: '#06B6D4' },
      { icon: Plane, title: 'Drone Delivery', desc: 'Emergency med drones', route: '/drone-delivery', from: '#F97316', to: '#EF4444' },
    ],
  },
  {
    label: 'Wellness & Lifestyle',
    color: 'hsl(var(--success))',
    emoji: '🧘',
    features: [
      { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans', route: '/nutrition', from: '#10B981', to: '#34D399' },
      { icon: Dumbbell, title: 'Physio & Rehab', desc: 'Exercise recovery', route: '/physiotherapy', from: '#6366F1', to: '#8B5CF6' },
      { icon: Move3D, title: 'Yoga & Meditation', desc: 'AI-guided sessions', route: '/yoga', from: '#14B8A6', to: '#10B981' },
      { icon: Syringe, title: 'Vaccination', desc: 'Smart vaccine scheduler', route: '/vaccination', from: '#F59E0B', to: '#F97316' },
      { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient match', route: '/blood-donation', from: '#EF4444', to: '#EC4899' },
      { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart risk assessment', route: '/cardiac-risk', from: '#DC2626', to: '#EF4444' },
    ],
  },
  {
    label: 'Advanced & Genomics',
    color: 'hsl(var(--chart-4))',
    emoji: '🧬',
    features: [
      { icon: Dna, title: 'Genetic Profiling', desc: 'DNA-based health insights', route: '/genetic-profiling', from: '#8B5CF6', to: '#EC4899' },
      { icon: Dna, title: 'Epigenetics', desc: 'Gene expression tracking', route: '/epigenetics', from: '#A855F7', to: '#6366F1' },
      { icon: Watch, title: 'Wearable Integration', desc: 'Sync fitness trackers', route: '/wearables', from: '#0EA5E9', to: '#3B82F6' },
      { icon: Shield, title: 'Blockchain Records', desc: 'Tamper-proof health data', route: '/blockchain-records', from: '#EF4444', to: '#F97316' },
      { icon: Ear, title: 'Hearing Health', desc: 'Early hearing detection', route: '/hearing-health', from: '#F59E0B', to: '#10B981' },
      { icon: Users, title: 'Family Health Hub', desc: 'Family health manager', route: '/family-health', from: '#F97316', to: '#EC4899' },
    ],
  },
  {
    label: 'Finance & Management',
    color: 'hsl(var(--warning))',
    emoji: '💰',
    features: [
      { icon: ShieldCheck, title: 'Insurance Optimizer', desc: 'AI insurance comparison', route: '/insurance', from: '#3B82F6', to: '#8B5CF6' },
      { icon: Wallet, title: 'Health Wallet', desc: 'Unified health payments', route: '/health-wallet', from: '#F59E0B', to: '#EF4444' },
      { icon: RefreshCw, title: 'Auto Refill', desc: 'Auto medication refills', route: '/auto-refill', from: '#10B981', to: '#06B6D4' },
      { icon: Globe, title: 'Voice Assistant', desc: 'Multilingual health AI', route: '/voice-assistant', from: '#6366F1', to: '#0EA5E9' },
    ],
  },
];

const totalFeatures = categories.reduce((sum, c) => sum + c.features.length, 0);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-10">
      {/* Stunning Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className="relative overflow-hidden rounded-2xl p-8 md:p-12"
      >
        {/* Animated multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-transparent to-amber-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.3),transparent_60%)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">S47 Health Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight"
          >
            Your Complete Health
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-transparent">
              Ecosystem ✨
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-white/70 text-base md:text-lg leading-relaxed max-w-xl"
          >
            {totalFeatures} powerful features across {categories.length} categories — AI diagnostics, telehealth, wellness, genomics & more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { value: totalFeatures, label: 'Features', icon: Zap, bg: 'from-cyan-400/20 to-blue-400/20' },
              { value: categories.length, label: 'Categories', icon: BarChart3, bg: 'from-purple-400/20 to-pink-400/20' },
              { value: '100%', label: 'All Live', icon: Star, bg: 'from-amber-400/20 to-orange-400/20' },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center gap-3 bg-gradient-to-r ${stat.bg} backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3`}>
                <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Categories */}
      {categories.map((category, catIdx) => (
        <motion.div
          key={category.label}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={containerVariants}
          className="space-y-4"
        >
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${categoryGradients[catIdx]} flex items-center justify-center text-lg shadow-lg`}>
              {category.emoji}
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold">{category.label}</h2>
              <p className="text-[11px] text-muted-foreground">{category.features.length} features available</p>
            </div>
            <Badge variant="secondary" className={`ml-auto text-[10px] font-bold bg-gradient-to-r ${categoryGradients[catIdx]} text-white border-0`}>
              {category.features.length}
            </Badge>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {category.features.map((feature) => (
              <motion.div key={feature.route} variants={itemVariants}>
                <Card
                  className="group cursor-pointer relative overflow-hidden border border-border/50 hover:border-transparent transition-all duration-500 h-full hover:shadow-xl hover:shadow-primary/5"
                  onClick={() => navigate(feature.route)}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${feature.from}, ${feature.to})` }}
                  />

                  <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full justify-center relative z-10">
                    {/* Icon with vibrant gradient */}
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{ background: `linear-gradient(135deg, ${feature.from}, ${feature.to})` }}
                    >
                      <feature.icon className="h-5 w-5 text-white drop-shadow-sm" />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors duration-300">{feature.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{feature.desc}</p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground/50 group-hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                      Open <ArrowRight className="h-2.5 w-2.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-2">🚀 All {totalFeatures} features are live and ready</p>
          <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Start Exploring Your Health Journey
          </h3>
          <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">
            Click any feature above to dive in. Your health, powered by AI.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
