import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  TrendingUp, TrendingDown, Heart, Clock, FileText, Bell,
  Rocket, Scan, Brain, Globe, Dna, Watch, FlaskConical,
  Shield, Plane, Building2, RefreshCw, Globe2, Users, Apple,
  Dumbbell, HeartPulse, ShieldCheck, CircleDot, Ear,
  Wallet, Stethoscope, ArrowRight, Zap, Star, BarChart3,
  CheckCircle2, Target, Flame, Trophy, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DoctorDashboard from './DoctorDashboard';
import PharmacistDashboard from './PharmacistDashboard';

const adherenceData = [
  { day: 'Mon', adherence: 85, target: 90 }, { day: 'Tue', adherence: 90, target: 90 }, { day: 'Wed', adherence: 78, target: 90 },
  { day: 'Thu', adherence: 92, target: 90 }, { day: 'Fri', adherence: 88, target: 90 }, { day: 'Sat', adherence: 95, target: 90 },
  { day: 'Sun', adherence: 82, target: 90 },
];

const symptomData = [
  { name: 'Headache', count: 5 }, { name: 'Fatigue', count: 3 }, { name: 'Cough', count: 2 },
  { name: 'Fever', count: 1 }, { name: 'Nausea', count: 1 },
];

const additionalFeatures = [
  { icon: Scan, title: 'AI Image Diagnosis', route: '/image-diagnosis', color: 'from-violet-500 to-purple-600' },
  { icon: Brain, title: 'Mental Health AI', route: '/mental-health', color: 'from-rose-500 to-pink-600' },
  { icon: Users, title: 'Family Health Hub', route: '/family-health', color: 'from-amber-500 to-orange-600' },
  { icon: Globe, title: 'Voice Assistant', route: '/voice-assistant', color: 'from-cyan-500 to-blue-600' },
  { icon: Dna, title: 'Genetic Profiling', route: '/genetic-profiling', color: 'from-fuchsia-500 to-purple-600' },
  { icon: Watch, title: 'Wearable Integration', route: '/wearables', color: 'from-sky-500 to-indigo-500' },
  { icon: FlaskConical, title: 'Home Lab Booking', route: '/lab-booking', color: 'from-emerald-500 to-teal-600' },
  { icon: Shield, title: 'Blockchain Records', route: '/blockchain-records', color: 'from-orange-500 to-red-500' },
  { icon: Plane, title: 'Drone Delivery', route: '/drone-delivery', color: 'from-yellow-500 to-amber-600' },
  { icon: Building2, title: 'Hospital Queue', route: '/hospital-queue', color: 'from-teal-500 to-cyan-600' },
  { icon: RefreshCw, title: 'Auto Refill', route: '/auto-refill', color: 'from-lime-500 to-green-600' },
  { icon: Globe2, title: 'Global Telemedicine', route: '/global-telemedicine', color: 'from-blue-500 to-indigo-600' },
  { icon: Stethoscope, title: 'AI Radiology', route: '/radiology', color: 'from-indigo-500 to-violet-600' },
  { icon: Apple, title: 'Nutrition Planner', route: '/nutrition', color: 'from-green-500 to-emerald-600' },
  { icon: Dumbbell, title: 'Physio & Rehab', route: '/physiotherapy', color: 'from-cyan-500 to-teal-600' },
  { icon: HeartPulse, title: 'Cardiac Risk', route: '/cardiac-risk', color: 'from-red-500 to-rose-600' },
  { icon: ShieldCheck, title: 'Insurance Optimizer', route: '/insurance', color: 'from-blue-500 to-violet-600' },
  { icon: CircleDot, title: 'Blood Donation', route: '/blood-donation', color: 'from-red-500 to-pink-600' },
  { icon: Dna, title: 'Epigenetics', route: '/epigenetics', color: 'from-purple-500 to-indigo-600' },
  { icon: Wallet, title: 'Health Wallet', route: '/health-wallet', color: 'from-amber-500 to-yellow-600' },
  { icon: Ear, title: 'Hearing Health', route: '/hearing-health', color: 'from-teal-500 to-emerald-600' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const riskScore = 32;
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');
  const isDoctorRole = profile?.role === 'doctor';

  if (isDoctorRole) {
    return <DoctorDashboard />;
  }

  const recentActivity = [
    { icon: Pill, text: t('activity.tookMedicine'), time: `2 ${t('time.hoursAgo')}`, gradient: 'from-emerald-500 to-teal-500', status: 'completed' },
    { icon: Activity, text: t('activity.symptomCheck'), time: `5 ${t('time.hoursAgo')}`, gradient: 'from-blue-500 to-cyan-500', status: 'completed' },
    { icon: FileText, text: t('activity.prescriptionUpload'), time: `1 ${t('time.dayAgo')}`, gradient: 'from-violet-500 to-purple-500', status: 'pending' },
    { icon: MessageSquare, text: t('activity.aiSession'), time: `2 ${t('time.daysAgo')}`, gradient: 'from-amber-500 to-orange-500', status: 'completed' },
  ];

  const quickActions = [
    { title: t('actions.symptomChecker'), icon: Activity, url: '/symptoms', gradient: 'from-blue-500 to-indigo-600', desc: 'AI-powered analysis' },
    { title: t('actions.medicineLookup'), icon: Pill, url: '/medicines', gradient: 'from-emerald-500 to-teal-600', desc: 'Search 10,000+ drugs' },
    { title: t('actions.bookAppointment'), icon: Calendar, url: '/telemedicine', gradient: 'from-violet-500 to-purple-600', desc: 'Video consultation' },
    { title: t('actions.drugInteractions'), icon: AlertTriangle, url: '/interactions', gradient: 'from-amber-500 to-orange-600', desc: 'Safety checker' },
    { title: t('actions.aiConsultation'), icon: MessageSquare, url: '/consultation', gradient: 'from-rose-500 to-pink-600', desc: 'Chat with AI doctor' },
    { title: t('actions.emergency'), icon: AlertCircle, url: '/emergency', gradient: 'from-red-500 to-rose-600', desc: 'SOS & first aid' },
  ];

  const stats = [
    { label: t('dashboard.adherenceRate'), value: '87%', icon: Heart, trend: '+3%', up: true, gradient: 'from-rose-500 to-pink-600' },
    { label: t('dashboard.activeReminders'), value: '5', icon: Bell, trend: `2 ${t('dashboard.today')}`, up: true, gradient: 'from-blue-500 to-indigo-600' },
    { label: t('dashboard.riskScore'), value: riskScore.toString(), icon: Activity, trend: '-5', up: false, gradient: riskScore < 40 ? 'from-emerald-500 to-teal-600' : 'from-amber-500 to-orange-600' },
    { label: t('dashboard.prescriptions'), value: '3', icon: FileText, trend: `1 ${t('dashboard.active')}`, up: true, gradient: 'from-violet-500 to-purple-600' },
  ];

  const healthGoals = [
    { label: 'Steps Today', value: 7240, target: 10000, icon: Flame, gradient: 'from-orange-500 to-red-500' },
    { label: 'Water Intake', value: 6, target: 8, icon: Target, gradient: 'from-cyan-500 to-blue-600' },
    { label: 'Sleep Hours', value: 7.2, target: 8, icon: Clock, gradient: 'from-indigo-500 to-violet-600' },
    { label: 'Streak', value: 12, target: 30, icon: Trophy, gradient: 'from-amber-500 to-yellow-500' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* ═══ PAGE BACKGROUND AMBIENT GLOW ═══ */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent 70%)' }} />
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Multi-layer background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0f0720 0%, #1a0a3e 20%, #0d1b4a 45%, #0a2540 65%, #051e2c 100%)',
        }} />

        {/* Animated mesh */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          style={{ background: 'conic-gradient(from 0deg, transparent, rgba(139,92,246,0.08), transparent, rgba(236,72,153,0.06), transparent, rgba(6,182,212,0.07), transparent)' }}
        />

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-80px] right-[8%] w-[350px] h-[350px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [15, -20, 15], x: [8, -12, 8] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-70px] left-[3%] w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [-10, 15, -10], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[35%] w-[200px] h-[200px] rounded-full blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)' }}
        />

        {/* Star grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Sweeping light beam */}
        <motion.div
          animate={{ x: ['-100%', '250%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          className="absolute top-1/2 h-[1px] w-1/4 opacity-25"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
        />

        <div className="relative z-10 p-7 md:p-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] backdrop-blur-md rounded-full px-4 py-1.5 mb-5">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <span className="text-white/60 text-[11px] font-semibold tracking-wide">All Systems Live</span>
              <Sparkles className="h-3 w-3 text-amber-400/60" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-[1.1]"
          >
            {t('dashboard.welcome')},{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                {profile?.name || 'User'}
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>{' '}
            <motion.span animate={{ rotate: [0, 14, -8, 14, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
              👋
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-white/40 text-sm md:text-base max-w-xl leading-relaxed"
          >
            {t('dashboard.subtitle')}
          </motion.p>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 mt-7"
          >
            {[
              { value: '87%', label: 'Adherence', icon: Heart, gradient: 'from-rose-400 to-pink-500', glow: 'rgba(244,63,94,0.3)' },
              { value: '5', label: 'Reminders', icon: Bell, gradient: 'from-cyan-400 to-blue-500', glow: 'rgba(6,182,212,0.3)' },
              { value: 'Low', label: 'Risk', icon: Shield, gradient: 'from-emerald-400 to-teal-500', glow: 'rgba(16,185,129,0.3)' },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-2.5 cursor-default"
              >
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`} style={{ boxShadow: `0 4px 15px ${s.glow}` }}>
                  <s.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mt-5"
          >
            {[
              { label: t('dashboard.symptomCheck'), icon: Activity, url: '/symptoms', gradient: 'from-blue-500 to-indigo-600' },
              { label: t('dashboard.bookDoctor'), icon: Calendar, url: '/telemedicine', gradient: 'from-violet-500 to-purple-600' },
              { label: t('dashboard.viewPrescriptions'), icon: FileText, url: '/prescriptions', gradient: 'from-emerald-500 to-teal-600' },
            ].map((btn, i) => (
              <motion.div key={btn.url} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.08 }}>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r ${btn.gradient} hover:opacity-90 text-white border-0 gap-2 text-xs h-10 rounded-xl shadow-lg hover:shadow-xl`}
                  onClick={() => navigate(btn.url)}
                >
                  <btn.icon className="h-3.5 w-3.5" /> {btn.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ HEALTH GOALS MINI STRIP ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {healthGoals.map((goal, i) => {
          const pct = Math.round((goal.value / goal.target) * 100);
          return (
            <motion.div key={goal.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <Card className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${goal.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <goal.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{pct}%</span>
                  </div>
                  <p className="text-xl font-heading font-extrabold text-foreground">{goal.value}<span className="text-xs text-muted-foreground font-medium">/{goal.target}</span></p>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{goal.label}</p>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${goal.gradient} shadow-sm`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}>
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-border/50 relative bg-card/80 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
              <div className={`h-1.5 w-full bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.up ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15'}`}>
                    {stat.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-3xl font-heading font-extrabold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1 font-semibold">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══ CHARTS ROW ═══ */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Adherence chart */}
        <Card className="lg:col-span-2 overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">{t('dashboard.medicationAdherence')}</CardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tracking your daily compliance</p>
                </div>
              </div>
              <div className="flex bg-muted rounded-lg p-0.5">
                {(['week', 'month'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab === 'week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', fontSize: '11px', fontWeight: 600 }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 4" fill="none" dot={false} />
                <Area type="monotone" dataKey="adherence" stroke="#6366f1" fill="url(#adherenceG)" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'hsl(var(--card))' }} activeDot={{ r: 6, strokeWidth: 3, stroke: 'hsl(var(--card))' }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 px-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Actual
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="h-[1px] w-4 border-t border-dashed border-muted-foreground" /> Target
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk score */}
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="pb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">{t('dashboard.healthRiskScore')}</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">AI-calculated risk level</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2 pb-4">
            <div className="relative h-44 w-44">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" opacity="0.15" />
                <defs>
                  <linearGradient id="riskGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="url(#riskGrad2)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 263.9' }}
                  animate={{ strokeDasharray: `${(riskScore / 100) * 263.9} 263.9` }}
                  transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-4xl font-heading font-extrabold text-foreground"
                >
                  {riskScore}
                </motion.span>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">{t('dashboard.lowRisk')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="h-3 w-3" /> {t('dashboard.improvedBy')}
              </div>
              <Badge variant="secondary" className="text-[9px] font-bold">Excellent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ QUICK ACTIONS + ACTIVITY ═══ */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">{t('dashboard.quickActions')}</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">Access key features instantly</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 text-left group overflow-hidden relative"
                  onClick={() => navigate(action.url)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg shrink-0 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <action.icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="relative z-10 min-w-0">
                    <span className="text-xs font-bold text-foreground block truncate">{action.title}</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 block">{action.desc}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">{t('dashboard.recentActivity')}</CardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Your health journey log</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground h-7 px-2.5 font-bold rounded-lg hover:text-primary">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 shrink-0`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ SYMPTOM CHART ═══ */}
      <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">{t('dashboard.symptomFrequency')}</CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">Most reported symptoms this month</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[9px] font-bold">Last 30 days</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={symptomData} layout="vertical">
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={10} width={70} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', fontSize: '11px', fontWeight: 600 }} />
              <Bar dataKey="count" fill="url(#barGrad2)" radius={[0, 10, 10, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ═══ EXPLORE CTA ═══ */}
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
        <Card
          className="cursor-pointer group overflow-hidden hover:shadow-2xl transition-all duration-400 border-border/50 relative bg-card/80 backdrop-blur-sm"
          onClick={() => navigate('/coming-soon')}
        >
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-violet-500 via-pink-500 via-amber-500 to-emerald-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] via-pink-500/[0.03] to-cyan-500/[0.02] group-hover:from-violet-500/[0.06] group-hover:via-pink-500/[0.07] group-hover:to-cyan-500/[0.06] transition-all duration-500" />
          <CardContent className="p-6 md:p-8 relative">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                >
                  <Rocket className="h-7 w-7 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Star className="h-3 w-3 text-white" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-heading font-extrabold text-foreground">Explore All {additionalFeatures.length} Features</p>
                  <Badge className="bg-gradient-to-r from-violet-500 to-pink-500 text-white border-0 text-[9px] font-bold px-2">NEW</Badge>
                </div>
                <p className="text-xs text-muted-foreground">AI diagnostics, telehealth, wellness, genomics, finance & more</p>
                <div className="flex items-center gap-1.5 mt-3">
                  {additionalFeatures.slice(0, 7).map((f, i) => (
                    <div key={i} className={`h-7 w-7 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all duration-300 shadow-sm`}>
                      <f.icon className="h-3 w-3 text-white" />
                    </div>
                  ))}
                  <span className="text-[10px] text-muted-foreground font-bold ml-1.5">+{additionalFeatures.length - 7}</span>
                </div>
              </div>
              <motion.div
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary"
                whileHover={{ x: 4 }}
              >
                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
