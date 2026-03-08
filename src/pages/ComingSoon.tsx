import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  Scan, Brain, Users, Globe, Dna, Watch, FlaskConical, Shield, Plane,
  Building2, RefreshCw, Globe2, Stethoscope, Apple, Dumbbell,
  HeartPulse, ShieldCheck, CircleDot, Ear, Wallet, FileText,
  Bell, MapPin, BarChart3, Sparkles, Zap, ArrowRight, Star,
  Layers, ChevronRight
} from 'lucide-react';

const categories = [
  {
    label: 'Core Health Tools',
    desc: 'Essential tools for daily health management',
    icon: Activity,
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
    desc: 'Smart AI-powered health insights',
    icon: Brain,
    features: [
      { icon: MessageSquare, title: 'AI Consultation', desc: '24/7 AI doctor chat', route: '/consultation' },
      { icon: Scan, title: 'Image Diagnosis', desc: 'Medical image AI analysis', route: '/image-diagnosis' },
      { icon: Brain, title: 'Mental Health AI', desc: 'Emotional support & therapy', route: '/mental-health' },
      { icon: Stethoscope, title: 'AI Radiology', desc: 'CT, MRI & ultrasound AI', route: '/radiology' },
      { icon: BarChart3, title: 'Health Analytics', desc: 'Trends & insights', route: '/analytics' },
      { icon: FileText, title: 'AI Reports', desc: 'Auto-generated reports', route: '/reports' },
    ],
  },
  {
    label: 'Telehealth & Services',
    desc: 'Connect with healthcare providers',
    icon: Globe2,
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
    label: 'Wellness & Lifestyle',
    desc: 'Nutrition, fitness & wellness tracking',
    icon: HeartPulse,
    features: [
      { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans', route: '/nutrition' },
      { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient match', route: '/blood-donation' },
      { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart risk assessment', route: '/cardiac-risk' },
    ],
  },
  {
    label: 'Advanced & Genomics',
    desc: 'Cutting-edge health technology',
    icon: Dna,
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
    label: 'Finance & Management',
    desc: 'Health finance & automation tools',
    icon: Wallet,
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
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-8">
      {/* ===== HERO — clean, light ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-accent/80 p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <Layers className="h-4 w-4 text-primary-foreground/70" />
            <span className="text-primary-foreground/60 text-xs font-bold uppercase tracking-[0.25em]">S47 Health Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground leading-tight tracking-tight"
          >
            Unified Health Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-3 text-primary-foreground/55 text-sm md:text-base max-w-xl"
          >
            {totalFeatures} features across {categories.length} categories — everything you need for complete health management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { value: totalFeatures, label: 'Features', icon: Zap },
              { value: categories.length, label: 'Categories', icon: Layers },
              { value: '100%', label: 'All Live', icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5"
              >
                <stat.icon className="h-4 w-4 text-primary-foreground/70" />
                <div>
                  <p className="text-lg font-bold text-primary-foreground leading-none">{stat.value}</p>
                  <p className="text-[9px] text-primary-foreground/40 uppercase tracking-widest font-semibold mt-0.5">{stat.label}</p>
                </div>
              </div>
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
          viewport={{ once: true, margin: '-40px' }}
          variants={containerVariants}
          className="space-y-4"
        >
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <category.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-heading font-bold text-foreground">{category.label}</h2>
              <p className="text-xs text-muted-foreground">{category.desc}</p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {category.features.length} features
            </Badge>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {category.features.map((feature) => (
              <motion.div key={feature.route} variants={itemVariants}>
                <Card
                  className="group cursor-pointer h-full hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full justify-center">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center transition-colors duration-300">
                      <feature.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {feature.desc}
                      </p>
                    </div>

                    {/* Hover arrow */}
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      Open <ArrowRight className="h-2.5 w-2.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* ===== FOOTER CTA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 via-primary to-accent/80 p-8 md:p-12 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative z-10">
          <Sparkles className="h-7 w-7 text-primary-foreground/70 mx-auto mb-3" />
          <p className="text-primary-foreground/50 text-xs font-medium mb-2">All {totalFeatures} features are live and ready</p>
          <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-primary-foreground leading-tight">
            Start Exploring Your Health Journey
          </h3>
          <p className="text-primary-foreground/45 text-sm mt-2 max-w-md mx-auto">
            Click any feature above to dive in. Your health, powered by AI.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
