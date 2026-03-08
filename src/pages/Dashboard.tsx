import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  TrendingUp, TrendingDown, Heart, Clock, FileText, Bell, Sparkles,
  Rocket, ExternalLink, Scan, Brain, Globe, Dna, Watch, FlaskConical,
  Shield, Plane, Building2, RefreshCw, Globe2, Users, Apple,
  Dumbbell, HeartPulse, ShieldCheck, CircleDot, Ear,
  Wallet, Stethoscope, ArrowRight, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const adherenceData = [
  { day: 'Mon', adherence: 85 }, { day: 'Tue', adherence: 90 }, { day: 'Wed', adherence: 78 },
  { day: 'Thu', adherence: 92 }, { day: 'Fri', adherence: 88 }, { day: 'Sat', adherence: 95 },
  { day: 'Sun', adherence: 82 },
];

const symptomData = [
  { name: 'Headache', count: 5 }, { name: 'Fatigue', count: 3 }, { name: 'Cough', count: 2 },
  { name: 'Fever', count: 1 }, { name: 'Nausea', count: 1 },
];

const additionalFeatures = [
  { icon: Scan, title: 'AI Image Diagnosis', desc: 'Upload medical images for AI analysis', route: '/image-diagnosis' },
  { icon: Brain, title: 'Mental Health AI', desc: '24/7 emotional support & therapy', route: '/mental-health' },
  { icon: Users, title: 'Family Health Hub', desc: 'Manage family health in one place', route: '/family-health' },
  { icon: Globe, title: 'Voice Assistant', desc: 'Multilingual health assistant', route: '/voice-assistant' },
  { icon: Dna, title: 'Genetic Profiling', desc: 'Personalized genetic health insights', route: '/genetic-profiling' },
  { icon: Watch, title: 'Wearable Integration', desc: 'Connect fitness trackers & smartwatches', route: '/wearables' },
  { icon: FlaskConical, title: 'Home Lab Booking', desc: 'Book lab tests from home', route: '/lab-booking' },
  { icon: Shield, title: 'Blockchain Records', desc: 'Secure tamper-proof health records', route: '/blockchain-records' },
  { icon: Plane, title: 'Drone Delivery', desc: 'Emergency medicine via drones', route: '/drone-delivery' },
  { icon: Building2, title: 'Hospital Queue', desc: 'Real-time queue tracking & booking', route: '/hospital-queue' },
  { icon: RefreshCw, title: 'Auto Refill', desc: 'Automatic medication refills', route: '/auto-refill' },
  { icon: Globe2, title: 'Global Telemedicine', desc: 'Connect with doctors worldwide', route: '/global-telemedicine' },
  { icon: Stethoscope, title: 'AI Radiology', desc: 'CT scan, MRI & ultrasound AI analysis', route: '/radiology' },
  { icon: Apple, title: 'Nutrition Planner', desc: 'AI meal plans for your health', route: '/nutrition' },
  { icon: Dumbbell, title: 'Physio & Rehab', desc: 'AI-guided exercise recovery', route: '/physiotherapy' },
  { icon: HeartPulse, title: 'Cardiac Risk', desc: 'Heart disease risk assessment', route: '/cardiac-risk' },
  { icon: ShieldCheck, title: 'Insurance Optimizer', desc: 'AI insurance comparison', route: '/insurance' },
  { icon: CircleDot, title: 'Blood Donation', desc: 'Donor-recipient matching', route: '/blood-donation' },
  { icon: Dna, title: 'Epigenetics', desc: 'Gene expression tracking', route: '/epigenetics' },
  { icon: Wallet, title: 'Health Wallet', desc: 'Unified health payments', route: '/health-wallet' },
  { icon: Ear, title: 'Hearing Health', desc: 'Early hearing loss detection', route: '/hearing-health' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const riskScore = 32;

  const recentActivity = [
    { icon: Pill, text: t('activity.tookMedicine'), time: `2 ${t('time.hoursAgo')}`, color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: Activity, text: t('activity.symptomCheck'), time: `5 ${t('time.hoursAgo')}`, color: 'text-blue-500 bg-blue-500/10' },
    { icon: FileText, text: t('activity.prescriptionUpload'), time: `1 ${t('time.dayAgo')}`, color: 'text-violet-500 bg-violet-500/10' },
    { icon: MessageSquare, text: t('activity.aiSession'), time: `2 ${t('time.daysAgo')}`, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const quickActions = [
    { title: t('actions.symptomChecker'), icon: Activity, url: '/symptoms', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: t('actions.medicineLookup'), icon: Pill, url: '/medicines', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: t('actions.bookAppointment'), icon: Calendar, url: '/telemedicine', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { title: t('actions.drugInteractions'), icon: AlertTriangle, url: '/interactions', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: t('actions.aiConsultation'), icon: MessageSquare, url: '/consultation', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    { title: t('actions.emergency'), icon: AlertCircle, url: '/emergency', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner — clean, minimal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-accent/80 p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest mb-1">
            {t('dashboard.title')}
          </p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">
            {t('dashboard.welcome')}, {profile?.name || 'User'} 👋
          </h2>
          <p className="mt-1.5 text-primary-foreground/65 text-sm max-w-lg">{t('dashboard.subtitle')}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: t('dashboard.symptomCheck'), icon: Activity, url: '/symptoms' },
              { label: t('dashboard.bookDoctor'), icon: Calendar, url: '/telemedicine' },
              { label: t('dashboard.viewPrescriptions'), icon: FileText, url: '/prescriptions' },
            ].map((btn) => (
              <Button
                key={btn.url}
                size="sm"
                variant="secondary"
                className="bg-white/15 hover:bg-white/25 text-primary-foreground border-0 backdrop-blur-sm gap-1.5 text-xs"
                onClick={() => navigate(btn.url)}
              >
                <btn.icon className="h-3.5 w-3.5" /> {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stat Cards — clean with subtle left accent */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.adherenceRate'), value: '87%', icon: Heart, trend: '+3%', up: true, accent: 'border-l-emerald-500' },
          { label: t('dashboard.activeReminders'), value: '5', icon: Bell, trend: `2 ${t('dashboard.today')}`, up: true, accent: 'border-l-blue-500' },
          { label: t('dashboard.riskScore'), value: riskScore.toString(), icon: Activity, trend: '-5', up: false, accent: riskScore < 40 ? 'border-l-emerald-500' : 'border-l-amber-500' },
          { label: t('dashboard.prescriptions'), value: '3', icon: FileText, trend: `1 ${t('dashboard.active')}`, up: true, accent: 'border-l-violet-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className={`border-l-[3px] ${stat.accent} hover:shadow-md transition-shadow duration-300`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                  <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Adherence Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-sm font-semibold">{t('dashboard.medicationAdherence')}</CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px]">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="adherence" stroke="hsl(var(--primary))" fill="url(#adherenceGradient)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score — clean ring */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-sm font-semibold">{t('dashboard.healthRiskScore')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="6"
                  strokeDasharray={`${(riskScore / 100) * 251.3} 251.3`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-bold text-foreground">{riskScore}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{t('dashboard.lowRisk')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3 w-3" /> {t('dashboard.improvedBy')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Actions — clean icon buttons */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`flex items-center gap-3 p-3.5 rounded-xl ${action.bg} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left group`}
                  onClick={() => navigate(action.url)}
                >
                  <div className={`h-9 w-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <span className={`text-xs font-semibold ${action.color}`}>{action.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity — clean timeline */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('dashboard.recentActivity')}</CardTitle>
              <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground h-7 px-2">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symptom Frequency — refined */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-sm font-semibold">{t('dashboard.symptomFrequency')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={symptomData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={11} width={80} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={16} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Explore All Features — refined CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card
          className="cursor-pointer group overflow-hidden border-dashed hover:border-primary/30 transition-colors duration-300"
          onClick={() => navigate('/coming-soon')}
        >
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Compact icon grid */}
              <div className="grid grid-cols-5 gap-1.5 shrink-0">
                {additionalFeatures.slice(0, 10).map((feature) => (
                  <div
                    key={feature.route}
                    className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300"
                  >
                    <feature.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                ))}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Explore All {additionalFeatures.length} Features</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  View the complete S47 Health ecosystem — AI diagnostics, telehealth, wellness, genomics & more.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-1 mt-3 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                  Open Unified Dashboard <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
