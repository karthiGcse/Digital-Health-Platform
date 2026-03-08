import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  TrendingUp, TrendingDown, Heart, Clock, FileText, Bell, Sparkles,
  Rocket, Scan, Brain, Globe, Dna, Watch, FlaskConical,
  Shield, Plane, Building2, RefreshCw, Globe2, Users, Apple,
  Dumbbell, HeartPulse, ShieldCheck, CircleDot, Ear,
  Wallet, Stethoscope, ArrowRight, Zap, Star, BarChart3, Layers
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
  { icon: Scan, title: 'AI Image Diagnosis', route: '/image-diagnosis', color: 'from-indigo-500 to-violet-500' },
  { icon: Brain, title: 'Mental Health AI', route: '/mental-health', color: 'from-pink-500 to-violet-500' },
  { icon: Users, title: 'Family Health Hub', route: '/family-health', color: 'from-orange-500 to-pink-500' },
  { icon: Globe, title: 'Voice Assistant', route: '/voice-assistant', color: 'from-indigo-500 to-cyan-500' },
  { icon: Dna, title: 'Genetic Profiling', route: '/genetic-profiling', color: 'from-purple-500 to-pink-500' },
  { icon: Watch, title: 'Wearable Integration', route: '/wearables', color: 'from-sky-500 to-blue-500' },
  { icon: FlaskConical, title: 'Home Lab Booking', route: '/lab-booking', color: 'from-emerald-500 to-teal-500' },
  { icon: Shield, title: 'Blockchain Records', route: '/blockchain-records', color: 'from-red-500 to-orange-500' },
  { icon: Plane, title: 'Drone Delivery', route: '/drone-delivery', color: 'from-orange-500 to-amber-500' },
  { icon: Building2, title: 'Hospital Queue', route: '/hospital-queue', color: 'from-teal-500 to-cyan-500' },
  { icon: RefreshCw, title: 'Auto Refill', route: '/auto-refill', color: 'from-emerald-500 to-teal-500' },
  { icon: Globe2, title: 'Global Telemedicine', route: '/global-telemedicine', color: 'from-cyan-500 to-blue-500' },
  { icon: Stethoscope, title: 'AI Radiology', route: '/radiology', color: 'from-blue-500 to-violet-500' },
  { icon: Apple, title: 'Nutrition Planner', route: '/nutrition', color: 'from-emerald-500 to-green-500' },
  { icon: Dumbbell, title: 'Physio & Rehab', route: '/physiotherapy', color: 'from-cyan-500 to-emerald-500' },
  { icon: HeartPulse, title: 'Cardiac Risk', route: '/cardiac-risk', color: 'from-rose-500 to-red-500' },
  { icon: ShieldCheck, title: 'Insurance Optimizer', route: '/insurance', color: 'from-blue-500 to-violet-500' },
  { icon: CircleDot, title: 'Blood Donation', route: '/blood-donation', color: 'from-red-500 to-pink-500' },
  { icon: Dna, title: 'Epigenetics', route: '/epigenetics', color: 'from-violet-500 to-indigo-500' },
  { icon: Wallet, title: 'Health Wallet', route: '/health-wallet', color: 'from-amber-500 to-orange-500' },
  { icon: Ear, title: 'Hearing Health', route: '/hearing-health', color: 'from-amber-500 to-emerald-500' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const riskScore = 32;

  const recentActivity = [
    { icon: Pill, text: t('activity.tookMedicine'), time: `2 ${t('time.hoursAgo')}`, gradient: 'from-emerald-500 to-teal-500' },
    { icon: Activity, text: t('activity.symptomCheck'), time: `5 ${t('time.hoursAgo')}`, gradient: 'from-blue-500 to-cyan-500' },
    { icon: FileText, text: t('activity.prescriptionUpload'), time: `1 ${t('time.dayAgo')}`, gradient: 'from-violet-500 to-purple-500' },
    { icon: MessageSquare, text: t('activity.aiSession'), time: `2 ${t('time.daysAgo')}`, gradient: 'from-amber-500 to-orange-500' },
  ];

  const quickActions = [
    { title: t('actions.symptomChecker'), icon: Activity, url: '/symptoms', gradient: 'from-blue-500 to-cyan-500' },
    { title: t('actions.medicineLookup'), icon: Pill, url: '/medicines', gradient: 'from-emerald-500 to-teal-500' },
    { title: t('actions.bookAppointment'), icon: Calendar, url: '/telemedicine', gradient: 'from-violet-500 to-purple-500' },
    { title: t('actions.drugInteractions'), icon: AlertTriangle, url: '/interactions', gradient: 'from-amber-500 to-orange-500' },
    { title: t('actions.aiConsultation'), icon: MessageSquare, url: '/consultation', gradient: 'from-pink-500 to-rose-500' },
    { title: t('actions.emergency'), icon: AlertCircle, url: '/emergency', gradient: 'from-red-500 to-rose-500' },
  ];

  const stats = [
    { label: t('dashboard.adherenceRate'), value: '87%', icon: Heart, trend: '+3%', up: true, gradient: 'from-emerald-500 to-teal-500' },
    { label: t('dashboard.activeReminders'), value: '5', icon: Bell, trend: `2 ${t('dashboard.today')}`, up: true, gradient: 'from-blue-500 to-cyan-500' },
    { label: t('dashboard.riskScore'), value: riskScore.toString(), icon: Activity, trend: '-5', up: false, gradient: riskScore < 40 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500' },
    { label: t('dashboard.prescriptions'), value: '3', icon: FileText, trend: `1 ${t('dashboard.active')}`, up: true, gradient: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="space-y-5">
      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-7 md:p-10"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e3a5f 100%)',
        }}
      >
        {/* Animated orbs */}
        <motion.div
          animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-40px] right-[-20px] w-[280px] h-[280px] rounded-full blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [8, -10, 8], x: [4, -6, 4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-50px] left-[-15px] w-[220px] h-[220px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-[150px] h-[150px] rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.1] backdrop-blur-md rounded-full px-3.5 py-1.5 mb-4">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="text-white/60 text-[10px] font-semibold tracking-wide">{t('dashboard.title')}</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-2xl md:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight"
          >
            {t('dashboard.welcome')},{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {profile?.name || 'User'}
            </span>{' '}
            👋
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-2 text-white/40 text-sm max-w-lg"
          >
            {t('dashboard.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-2 mt-6"
          >
            {[
              { label: t('dashboard.symptomCheck'), icon: Activity, url: '/symptoms', gradient: 'from-blue-500 to-cyan-500' },
              { label: t('dashboard.bookDoctor'), icon: Calendar, url: '/telemedicine', gradient: 'from-violet-500 to-purple-500' },
              { label: t('dashboard.viewPrescriptions'), icon: FileText, url: '/prescriptions', gradient: 'from-emerald-500 to-teal-500' },
            ].map((btn) => (
              <motion.div key={btn.url} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r ${btn.gradient} hover:opacity-90 text-white border-0 gap-1.5 text-xs h-9 rounded-xl shadow-lg`}
                  onClick={() => navigate(btn.url)}
                >
                  <btn.icon className="h-3.5 w-3.5" /> {btn.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
          >
            <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              {/* Top gradient line */}
              <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-lg ${stat.up ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15'}`}>
                    {stat.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-heading font-extrabold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                  <TrendingUp className="h-3.5 w-3.5 text-white" />
                </div>
                <CardTitle className="text-sm font-bold">{t('dashboard.medicationAdherence')}</CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '11px' }} />
                <Area type="monotone" dataKey="adherence" stroke="#3b82f6" fill="url(#adherenceG)" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <CardTitle className="text-sm font-bold">{t('dashboard.healthRiskScore')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-3">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" opacity="0.3" />
                <defs>
                  <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#riskGrad)"
                  strokeWidth="6"
                  strokeDasharray={`${(riskScore / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 drop-shadow-sm"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-extrabold text-foreground">{riskScore}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t('dashboard.lowRisk')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3 w-3" /> {t('dashboard.improvedBy')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ QUICK ACTIONS + ACTIVITY ═══ */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <CardTitle className="text-sm font-bold">{t('dashboard.quickActions')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-200 text-left group overflow-hidden relative"
                  onClick={() => navigate(action.url)}
                >
                  {/* Subtle hover bg */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`} />
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md shrink-0 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors relative z-10">{action.title}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Clock className="h-3.5 w-3.5 text-white" />
                </div>
                <CardTitle className="text-sm font-bold">{t('dashboard.recentActivity')}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground h-6 px-2 font-semibold">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-all group"
                >
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all shrink-0`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ SYMPTOM CHART ═══ */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-red-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-md">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <CardTitle className="text-sm font-bold">{t('dashboard.symptomFrequency')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={symptomData} layout="vertical">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={10} width={70} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '11px' }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[0, 8, 8, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ═══ EXPLORE CTA ═══ */}
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
        <Card
          className="cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300"
          onClick={() => navigate('/coming-soon')}
        >
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Star className="h-2.5 w-2.5 text-white" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Explore All {additionalFeatures.length} Features</p>
                <p className="text-xs text-muted-foreground mt-0.5">AI diagnostics, telehealth, wellness, genomics & more</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all">
                View all <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
