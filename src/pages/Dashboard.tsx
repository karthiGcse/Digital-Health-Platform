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
  Wallet, Stethoscope, ArrowRight, Zap, Star, BarChart3
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
  { icon: Scan, title: 'AI Image Diagnosis', route: '/image-diagnosis' },
  { icon: Brain, title: 'Mental Health AI', route: '/mental-health' },
  { icon: Users, title: 'Family Health Hub', route: '/family-health' },
  { icon: Globe, title: 'Voice Assistant', route: '/voice-assistant' },
  { icon: Dna, title: 'Genetic Profiling', route: '/genetic-profiling' },
  { icon: Watch, title: 'Wearable Integration', route: '/wearables' },
  { icon: FlaskConical, title: 'Home Lab Booking', route: '/lab-booking' },
  { icon: Shield, title: 'Blockchain Records', route: '/blockchain-records' },
  { icon: Plane, title: 'Drone Delivery', route: '/drone-delivery' },
  { icon: Building2, title: 'Hospital Queue', route: '/hospital-queue' },
  { icon: RefreshCw, title: 'Auto Refill', route: '/auto-refill' },
  { icon: Globe2, title: 'Global Telemedicine', route: '/global-telemedicine' },
  { icon: Stethoscope, title: 'AI Radiology', route: '/radiology' },
  { icon: Apple, title: 'Nutrition Planner', route: '/nutrition' },
  { icon: Dumbbell, title: 'Physio & Rehab', route: '/physiotherapy' },
  { icon: HeartPulse, title: 'Cardiac Risk', route: '/cardiac-risk' },
  { icon: ShieldCheck, title: 'Insurance Optimizer', route: '/insurance' },
  { icon: CircleDot, title: 'Blood Donation', route: '/blood-donation' },
  { icon: Dna, title: 'Epigenetics', route: '/epigenetics' },
  { icon: Wallet, title: 'Health Wallet', route: '/health-wallet' },
  { icon: Ear, title: 'Hearing Health', route: '/hearing-health' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const riskScore = 32;

  const recentActivity = [
    { icon: Pill, text: t('activity.tookMedicine'), time: `2 ${t('time.hoursAgo')}`, accent: 'bg-emerald-500' },
    { icon: Activity, text: t('activity.symptomCheck'), time: `5 ${t('time.hoursAgo')}`, accent: 'bg-blue-500' },
    { icon: FileText, text: t('activity.prescriptionUpload'), time: `1 ${t('time.dayAgo')}`, accent: 'bg-violet-500' },
    { icon: MessageSquare, text: t('activity.aiSession'), time: `2 ${t('time.daysAgo')}`, accent: 'bg-amber-500' },
  ];

  const quickActions = [
    { title: t('actions.symptomChecker'), icon: Activity, url: '/symptoms' },
    { title: t('actions.medicineLookup'), icon: Pill, url: '/medicines' },
    { title: t('actions.bookAppointment'), icon: Calendar, url: '/telemedicine' },
    { title: t('actions.drugInteractions'), icon: AlertTriangle, url: '/interactions' },
    { title: t('actions.aiConsultation'), icon: MessageSquare, url: '/consultation' },
    { title: t('actions.emergency'), icon: AlertCircle, url: '/emergency' },
  ];

  const stats = [
    { label: t('dashboard.adherenceRate'), value: '87%', icon: Heart, trend: '+3%', up: true },
    { label: t('dashboard.activeReminders'), value: '5', icon: Bell, trend: `2 ${t('dashboard.today')}`, up: true },
    { label: t('dashboard.riskScore'), value: riskScore.toString(), icon: Activity, trend: '-5', up: false },
    { label: t('dashboard.prescriptions'), value: '3', icon: FileText, trend: `1 ${t('dashboard.active')}`, up: true },
  ];

  return (
    <div className="space-y-5">
      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(230, 50%, 15%) 50%, hsl(260, 40%, 18%) 100%)',
        }}
      >
        {/* Subtle mesh */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/8 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Badge className="bg-white/10 text-white/70 border-white/10 text-[10px] font-medium mb-3 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1 text-amber-400" /> {t('dashboard.title')}
            </Badge>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
            {t('dashboard.welcome')}, {profile?.name || 'User'} 👋
          </h2>
          <p className="mt-1.5 text-white/50 text-sm max-w-lg">{t('dashboard.subtitle')}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: t('dashboard.symptomCheck'), icon: Activity, url: '/symptoms' },
              { label: t('dashboard.bookDoctor'), icon: Calendar, url: '/telemedicine' },
              { label: t('dashboard.viewPrescriptions'), icon: FileText, url: '/prescriptions' },
            ].map((btn) => (
              <Button
                key={btn.url}
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm gap-1.5 text-xs h-8 rounded-lg shadow-none"
                onClick={() => navigate(btn.url)}
              >
                <btn.icon className="h-3 w-3" /> {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
          >
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.up ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15'}`}>
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
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">{t('dashboard.medicationAdherence')}</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: '11px' }} />
                <Area type="monotone" dataKey="adherence" stroke="hsl(var(--primary))" fill="url(#adherenceG)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-semibold">{t('dashboard.healthRiskScore')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-2">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-sm">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" opacity="0.5" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="5"
                  strokeDasharray={`${(riskScore / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-extrabold text-foreground">{riskScore}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{t('dashboard.lowRisk')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3 w-3" /> {t('dashboard.improvedBy')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ QUICK ACTIONS + ACTIVITY ═══ */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">{t('dashboard.quickActions')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/60 hover:border-primary/20 transition-all duration-200 text-left group"
                  onClick={() => navigate(action.url)}
                >
                  <div className="h-8 w-8 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <action.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{action.title}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">{t('dashboard.recentActivity')}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground h-6 px-2">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${item.accent} border-2 border-card`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ SYMPTOM CHART ═══ */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm font-semibold">{t('dashboard.symptomFrequency')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={symptomData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={10} width={70} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: '11px' }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={14} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ═══ EXPLORE CTA ═══ */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className="cursor-pointer group overflow-hidden border-border/60 hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          onClick={() => navigate('/coming-soon')}
        >
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center gap-5">
              {/* Stacked icon cluster */}
              <div className="relative h-16 w-16 shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-lg bg-accent/15 flex items-center justify-center border-2 border-card">
                  <Star className="h-3 w-3 text-accent" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Explore All {additionalFeatures.length} Features</p>
                <p className="text-xs text-muted-foreground mt-0.5">AI diagnostics, telehealth, wellness, genomics & more</p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
