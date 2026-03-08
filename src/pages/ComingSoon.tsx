import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  Scan, Brain, Users, Globe, Dna, Watch, FlaskConical, Shield, Plane,
  Building2, RefreshCw, Globe2, Stethoscope, Syringe, Apple, Dumbbell,
  HeartPulse, ShieldCheck, CircleDot, Move3D, Ear, Wallet, FileText,
  Bell, MapPin, BarChart3, Sparkles, Zap, ArrowRight, Star, Crown
} from 'lucide-react';

const categoryThemes = [
  { gradient: 'from-blue-500 via-cyan-400 to-teal-400', glow: 'rgba(59,130,246,0.3)', border: 'rgba(6,182,212,0.4)' },
  { gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', glow: 'rgba(139,92,246,0.3)', border: 'rgba(168,85,247,0.4)' },
  { gradient: 'from-sky-400 via-blue-500 to-indigo-600', glow: 'rgba(14,165,233,0.3)', border: 'rgba(99,102,241,0.4)' },
  { gradient: 'from-emerald-400 via-green-500 to-teal-500', glow: 'rgba(16,185,129,0.3)', border: 'rgba(20,184,166,0.4)' },
  { gradient: 'from-pink-500 via-rose-500 to-red-400', glow: 'rgba(236,72,153,0.3)', border: 'rgba(244,63,94,0.4)' },
  { gradient: 'from-amber-400 via-orange-500 to-red-500', glow: 'rgba(245,158,11,0.3)', border: 'rgba(249,115,22,0.4)' },
];

const categories = [
  {
    label: 'Core Health Tools',
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
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen -m-4 md:-m-6 p-4 md:p-6 relative overflow-hidden">
      {/* Multi-layer cosmic background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0118]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-950/80 via-[#0a0118] to-purple-950/60" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(59,130,246,0.2),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(236,72,153,0.15),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.12),transparent_40%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(16,185,129,0.1),transparent_40%)]" />
      {/* Stars */}
      <div className="fixed inset-0 -z-10 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 -z-10 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '80px 80px' }} />

      <div className="space-y-12 pb-12 max-w-[1400px] mx-auto">
        {/* ===== HERO ===== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-14"
        >
          {/* Hero background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500" />
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/40 via-transparent to-emerald-400/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_60%)]" />
          
          {/* Animated floating orbs */}
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-16 w-48 h-48 bg-gradient-to-br from-white/15 to-cyan-300/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [10, -15, 10], x: [5, -8, 5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-16 left-10 w-72 h-72 bg-gradient-to-tr from-pink-400/15 to-violet-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-1/4 w-36 h-36 bg-gradient-to-r from-amber-400/15 to-orange-300/10 rounded-full blur-2xl"
          />
          
          {/* Mesh grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Crown className="h-5 w-5 text-amber-300" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">S47 Health Platform</span>
                <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-[9px] font-bold px-2">PREMIUM</Badge>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Your Complete Health
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
                Ecosystem ✨
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-xl"
            >
              {totalFeatures} powerful features across {categories.length} categories — AI diagnostics, telehealth, wellness, genomics & more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              {[
                { value: totalFeatures, label: 'Features', icon: Zap, from: '#06B6D4', to: '#3B82F6' },
                { value: categories.length, label: 'Categories', icon: BarChart3, from: '#8B5CF6', to: '#EC4899' },
                { value: '100%', label: 'All Live', icon: Star, from: '#F59E0B', to: '#EF4444' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3.5 cursor-default"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${stat.from}, ${stat.to})` }}
                  >
                    <stat.icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white leading-none">{stat.value}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ===== CATEGORIES ===== */}
        {categories.map((category, catIdx) => (
          <motion.div
            key={category.label}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={containerVariants}
            className="space-y-5"
          >
            {/* Category Header with glow line */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${categoryThemes[catIdx].gradient} flex items-center justify-center text-xl shadow-xl`}
                style={{ boxShadow: `0 8px 25px -5px ${categoryThemes[catIdx].glow}` }}
              >
                {category.emoji}
              </motion.div>
              <div className="flex-1">
                <h2 className="text-xl font-heading font-bold text-white">{category.label}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-[2px] flex-1 max-w-[100px] rounded-full" style={{ background: `linear-gradient(to right, ${categoryThemes[catIdx].border}, transparent)` }} />
                  <p className="text-[11px] text-white/40 font-medium">{category.features.length} features</p>
                </div>
              </div>
              <Badge className={`text-[10px] font-bold bg-gradient-to-r ${categoryThemes[catIdx].gradient} text-white border-0 shadow-lg px-3 py-1`}>
                {category.features.length}
              </Badge>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {category.features.map((feature) => (
                <motion.div key={feature.route} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="group cursor-pointer relative overflow-hidden h-full"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      onClick={() => navigate(feature.route)}
                    >
                      {/* Animated gradient border on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${feature.from}15, ${feature.to}15)`,
                        }}
                      />
                      <div
                        className="absolute inset-[0] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          border: `1px solid ${feature.from}40`,
                        }}
                      />
                      {/* Bottom glow */}
                      <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl rounded-full"
                        style={{ background: `linear-gradient(to right, ${feature.from}, ${feature.to})` }}
                      />

                      <CardContent className="p-4 md:p-5 flex flex-col items-center text-center gap-3 h-full justify-center relative z-10">
                        {/* Glowing icon */}
                        <div className="relative">
                          <div
                            className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110"
                            style={{
                              background: `linear-gradient(135deg, ${feature.from}, ${feature.to})`,
                              boxShadow: `0 4px 15px -3px ${feature.from}40`,
                            }}
                          >
                            <feature.icon className="h-6 w-6 text-white drop-shadow-md" />
                          </div>
                          {/* Icon glow ring */}
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-md"
                            style={{ background: `linear-gradient(135deg, ${feature.from}, ${feature.to})` }}
                          />
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-bold leading-tight text-white/90 group-hover:text-white transition-colors duration-300">
                            {feature.title}
                          </p>
                          <p className="text-[10px] text-white/35 leading-tight group-hover:text-white/50 transition-colors duration-300">
                            {feature.desc}
                          </p>
                        </div>

                        {/* Arrow CTA */}
                        <motion.div
                          initial={false}
                          className="flex items-center gap-1.5 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                          style={{ color: feature.from }}
                        >
                          Explore <ArrowRight className="h-3 w-3" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ===== FOOTER CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500" />
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/30 via-transparent to-emerald-400/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),transparent_60%)]" />
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 right-1/4 w-40 h-40 bg-cyan-300/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <Sparkles className="h-8 w-8 text-amber-300" />
            </motion.div>
            <p className="text-white/70 text-sm font-medium mb-3">🚀 All {totalFeatures} features are live and ready</p>
            <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
              Start Exploring Your
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent">
                Health Journey
              </span>
            </h3>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">
              Click any feature above to dive in. Your health, powered by AI.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
