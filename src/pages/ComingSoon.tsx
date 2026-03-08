import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  Scan, Brain, Users, Globe, Dna, Watch, FlaskConical, Shield, Plane,
  Building2, RefreshCw, Globe2, Stethoscope, Syringe, Apple, Dumbbell,
  HeartPulse, ShieldCheck, CircleDot, Move3D, Ear, Wallet, FileText,
  Bell, MapPin, BarChart3, Sparkles, Zap
} from 'lucide-react';

const categories = [
  {
    label: 'Core Health Tools',
    color: 'hsl(var(--primary))',
    features: [
      { icon: Activity, title: 'Symptom Checker', desc: 'AI-powered symptom analysis', route: '/symptoms', gradient: 'gradient-cool' },
      { icon: Pill, title: 'Medicine Lookup', desc: 'Drug info & alternatives', route: '/medicines', gradient: 'gradient-success' },
      { icon: AlertTriangle, title: 'Drug Interactions', desc: 'Safety conflict checker', route: '/interactions', gradient: 'gradient-warm' },
      { icon: FileText, title: 'Prescriptions', desc: 'Upload & manage Rx', route: '/prescriptions', gradient: 'gradient-health' },
      { icon: Bell, title: 'Reminders', desc: 'Never miss a dose', route: '/reminders', gradient: 'gradient-cool' },
      { icon: AlertCircle, title: 'Emergency', desc: 'Instant emergency help', route: '/emergency', gradient: 'gradient-danger' },
    ],
  },
  {
    label: 'AI & Diagnostics',
    color: 'hsl(var(--accent))',
    features: [
      { icon: MessageSquare, title: 'AI Consultation', desc: '24/7 AI doctor chat', route: '/consultation', gradient: 'gradient-health' },
      { icon: Scan, title: 'Image Diagnosis', desc: 'Medical image AI analysis', route: '/image-diagnosis', gradient: 'gradient-health' },
      { icon: Brain, title: 'Mental Health AI', desc: 'Emotional support & therapy', route: '/mental-health', gradient: 'gradient-cool' },
      { icon: Stethoscope, title: 'AI Radiology', desc: 'CT, MRI & ultrasound AI', route: '/radiology', gradient: 'gradient-cool' },
      { icon: BarChart3, title: 'Health Analytics', desc: 'Trends & insights', route: '/analytics', gradient: 'gradient-success' },
      { icon: FileText, title: 'AI Reports', desc: 'Auto-generated health reports', route: '/reports', gradient: 'gradient-warm' },
    ],
  },
  {
    label: 'Telehealth & Services',
    color: 'hsl(var(--info))',
    features: [
      { icon: Calendar, title: 'Telemedicine', desc: 'Video doctor visits', route: '/telemedicine', gradient: 'gradient-health' },
      { icon: Globe2, title: 'Global Telemedicine', desc: 'Worldwide specialists', route: '/global-telemedicine', gradient: 'gradient-health' },
      { icon: MapPin, title: 'Nearby Services', desc: 'Pharmacies & clinics', route: '/nearby', gradient: 'gradient-warm' },
      { icon: Building2, title: 'Hospital Queue', desc: 'Real-time queue tracking', route: '/hospital-queue', gradient: 'gradient-cool' },
      { icon: FlaskConical, title: 'Home Lab Booking', desc: 'Doorstep lab tests', route: '/lab-booking', gradient: 'gradient-success' },
      { icon: Plane, title: 'Drone Delivery', desc: 'Emergency med drones', route: '/drone-delivery', gradient: 'gradient-warm' },
    ],
  },
  {
    label: 'Wellness & Lifestyle',
    color: 'hsl(var(--success))',
    features: [
      { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans', route: '/nutrition', gradient: 'gradient-success' },
      { icon: Dumbbell, title: 'Physio & Rehab', desc: 'Exercise recovery', route: '/physiotherapy', gradient: 'gradient-health' },
      { icon: Move3D, title: 'Yoga & Meditation', desc: 'AI-guided sessions', route: '/yoga', gradient: 'gradient-success' },
      { icon: Syringe, title: 'Vaccination', desc: 'Smart vaccine scheduler', route: '/vaccination', gradient: 'gradient-warm' },
      { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient match', route: '/blood-donation', gradient: 'gradient-danger' },
      { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart risk assessment', route: '/cardiac-risk', gradient: 'gradient-danger' },
    ],
  },
  {
    label: 'Advanced & Genomics',
    color: 'hsl(var(--chart-4))',
    features: [
      { icon: Dna, title: 'Genetic Profiling', desc: 'DNA-based health insights', route: '/genetic-profiling', gradient: 'gradient-health' },
      { icon: Dna, title: 'Epigenetics', desc: 'Gene expression tracking', route: '/epigenetics', gradient: 'gradient-health' },
      { icon: Watch, title: 'Wearable Integration', desc: 'Sync fitness trackers', route: '/wearables', gradient: 'gradient-cool' },
      { icon: Shield, title: 'Blockchain Records', desc: 'Tamper-proof health data', route: '/blockchain-records', gradient: 'gradient-danger' },
      { icon: Ear, title: 'Hearing Health', desc: 'Early hearing detection', route: '/hearing-health', gradient: 'gradient-warm' },
      { icon: Users, title: 'Family Health Hub', desc: 'Family health manager', route: '/family-health', gradient: 'gradient-warm' },
    ],
  },
  {
    label: 'Finance & Management',
    color: 'hsl(var(--warning))',
    features: [
      { icon: ShieldCheck, title: 'Insurance Optimizer', desc: 'AI insurance comparison', route: '/insurance', gradient: 'gradient-health' },
      { icon: Wallet, title: 'Health Wallet', desc: 'Unified health payments', route: '/health-wallet', gradient: 'gradient-health' },
      { icon: RefreshCw, title: 'Auto Refill', desc: 'Auto medication refills', route: '/auto-refill', gradient: 'gradient-success' },
      { icon: Globe, title: 'Voice Assistant', desc: 'Multilingual health AI', route: '/voice-assistant', gradient: 'gradient-success' },
    ],
  },
];

const totalFeatures = categories.reduce((sum, c) => sum + c.features.length, 0);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card p-8 md:p-10">
        <div className="absolute inset-0 gradient-health animate-gradient opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-white/80" />
            <span className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em]">S47 Health Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
            Unified Health Dashboard
          </h1>
          <p className="mt-3 text-white/75 text-base md:text-lg leading-relaxed">
            All {totalFeatures} features under one roof — from AI diagnostics and telehealth to genomics and wellness. Your complete health ecosystem.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { value: totalFeatures, label: 'Features', icon: Zap },
              { value: categories.length, label: 'Categories', icon: BarChart3 },
              { value: '100%', label: 'Live', icon: Activity },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <stat.icon className="h-5 w-5 text-white/70" />
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category, catIdx) => (
        <motion.div
          key={category.label}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full" style={{ background: category.color }} />
            <h2 className="text-lg font-heading font-bold">{category.label}</h2>
            <Badge variant="secondary" className="text-[10px]">{category.features.length}</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {category.features.map((feature) => (
              <motion.div key={feature.route} variants={itemVariants}>
                <Card
                  className="group cursor-pointer card-hover border-transparent hover:border-primary/20 transition-all duration-300 h-full"
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2.5 h-full justify-center">
                    <div className={`${feature.gradient} h-11 w-11 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{feature.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ComingSoon;
