import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  TrendingUp, TrendingDown, Heart, Clock, FileText, Bell, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const adherenceData = [
  { day: 'Mon', adherence: 85 }, { day: 'Tue', adherence: 90 }, { day: 'Wed', adherence: 78 },
  { day: 'Thu', adherence: 92 }, { day: 'Fri', adherence: 88 }, { day: 'Sat', adherence: 95 },
  { day: 'Sun', adherence: 82 },
];

const symptomData = [
  { name: 'Headache', count: 5 }, { name: 'Fatigue', count: 3 }, { name: 'Cough', count: 2 },
  { name: 'Fever', count: 1 }, { name: 'Nausea', count: 1 },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const riskScore = 32;

  const recentActivity = [
    { icon: Pill, text: t('activity.tookMedicine'), time: `2 ${t('time.hoursAgo')}`, iconClass: 'stat-icon-green' },
    { icon: Activity, text: t('activity.symptomCheck'), time: `5 ${t('time.hoursAgo')}`, iconClass: 'stat-icon-blue' },
    { icon: FileText, text: t('activity.prescriptionUpload'), time: `1 ${t('time.dayAgo')}`, iconClass: 'stat-icon-purple' },
    { icon: MessageSquare, text: t('activity.aiSession'), time: `2 ${t('time.daysAgo')}`, iconClass: 'stat-icon-orange' },
  ];

  const quickActions = [
    { title: t('actions.symptomChecker'), icon: Activity, url: '/symptoms', gradient: 'gradient-cool' },
    { title: t('actions.medicineLookup'), icon: Pill, url: '/medicines', gradient: 'gradient-success' },
    { title: t('actions.bookAppointment'), icon: Calendar, url: '/telemedicine', gradient: 'gradient-health' },
    { title: t('actions.drugInteractions'), icon: AlertTriangle, url: '/interactions', gradient: 'gradient-warm' },
    { title: t('actions.aiConsultation'), icon: MessageSquare, url: '/consultation', gradient: 'gradient-health' },
    { title: t('actions.emergency'), icon: AlertCircle, url: '/emergency', gradient: 'gradient-danger' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="page-header gradient-health animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">{t('dashboard.title')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
            {t('dashboard.welcome')}, {profile?.name || 'User'} 👋
          </h2>
          <p className="mt-1 text-white/75 text-sm md:text-base">{t('dashboard.subtitle')}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm" onClick={() => navigate('/symptoms')}>
              <Activity className="h-3.5 w-3.5 mr-1" /> {t('dashboard.symptomCheck')}
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm" onClick={() => navigate('/telemedicine')}>
              <Calendar className="h-3.5 w-3.5 mr-1" /> {t('dashboard.bookDoctor')}
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm" onClick={() => navigate('/prescriptions')}>
              <FileText className="h-3.5 w-3.5 mr-1" /> {t('dashboard.viewPrescriptions')}
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.adherenceRate'), value: '87%', icon: Heart, trend: '+3%', up: true, iconClass: 'stat-icon-green' },
          { label: t('dashboard.activeReminders'), value: '5', icon: Bell, trend: `2 ${t('dashboard.today')}`, up: true, iconClass: 'stat-icon-blue' },
          { label: t('dashboard.riskScore'), value: riskScore.toString(), icon: Activity, trend: '-5', up: false, iconClass: riskScore < 40 ? 'stat-icon-green' : 'stat-icon-orange' },
          { label: t('dashboard.prescriptions'), value: '3', icon: FileText, trend: `1 ${t('dashboard.active')}`, up: true, iconClass: 'stat-icon-purple' },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={stat.iconClass}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? 'text-success' : 'text-warning'}`}>
                  {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-heading font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Adherence Chart */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="stat-icon-blue h-8 w-8">
                <TrendingUp className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">{t('dashboard.medicationAdherence')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="hsl(271, 81%, 56%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(271, 81%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }} />
                <Area type="monotone" dataKey="adherence" stroke="hsl(217, 91%, 53%)" fill="url(#adherenceGradient)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="stat-icon-green h-8 w-8">
                <Heart className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">{t('dashboard.healthRiskScore')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#riskGradient)" strokeWidth="8"
                  strokeDasharray={`${(riskScore / 100) * 251.3} 251.3`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(152, 76%, 42%)" />
                    <stop offset="100%" stopColor="hsl(170, 70%, 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-bold">{riskScore}</span>
                <span className="text-xs text-muted-foreground">{t('dashboard.lowRisk')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success font-medium">
              <TrendingDown className="h-3.5 w-3.5" /> {t('dashboard.improvedBy')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`${action.gradient} h-auto flex flex-col items-center gap-2 p-4 rounded-xl text-white hover:opacity-90 transition-all hover:scale-[1.02] shadow-md`}
                  onClick={() => navigate(action.url)}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{action.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('dashboard.recentActivity')}</CardTitle>
              <Button variant="link" size="sm" className="text-xs text-primary">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`${item.iconClass} h-9 w-9 shrink-0`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.text}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symptom Frequency */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="stat-icon-orange h-8 w-8">
              <Activity className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">{t('dashboard.symptomFrequency')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={symptomData} layout="vertical">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217, 91%, 53%)" />
                  <stop offset="100%" stopColor="hsl(271, 81%, 56%)" />
                </linearGradient>
              </defs>
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={12} width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 8, 8, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
