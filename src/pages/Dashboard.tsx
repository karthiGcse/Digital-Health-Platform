import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Pill, Calendar, AlertTriangle, MessageSquare, AlertCircle,
  TrendingUp, TrendingDown, Heart, Clock, FileText, Bell
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

const recentActivity = [
  { icon: Pill, text: 'Took Metformin 500mg', time: '2 hours ago', color: 'text-green-500' },
  { icon: Activity, text: 'Symptom check completed', time: '5 hours ago', color: 'text-primary' },
  { icon: FileText, text: 'Prescription uploaded', time: '1 day ago', color: 'text-purple-500' },
  { icon: MessageSquare, text: 'AI Consultation session', time: '2 days ago', color: 'text-amber-500' },
];

const quickActions = [
  { title: 'Symptom Checker', icon: Activity, url: '/symptoms', color: 'bg-blue-500/10 text-blue-600' },
  { title: 'Medicine Lookup', icon: Pill, url: '/medicines', color: 'bg-green-500/10 text-green-600' },
  { title: 'Book Appointment', icon: Calendar, url: '/telemedicine', color: 'bg-purple-500/10 text-purple-600' },
  { title: 'Drug Interactions', icon: AlertTriangle, url: '/interactions', color: 'bg-amber-500/10 text-amber-600' },
  { title: 'AI Consultation', icon: MessageSquare, url: '/consultation', color: 'bg-indigo-500/10 text-indigo-600' },
  { title: 'Emergency', icon: AlertCircle, url: '/emergency', color: 'bg-red-500/10 text-red-600' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const riskScore = 32;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-primary to-blue-700 p-6 md:p-8 text-primary-foreground">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Welcome back, {profile?.name || 'User'} 👋
          </h2>
          <p className="mt-1 text-primary-foreground/80 text-sm md:text-base">Your health journey continues. Stay on track with your medications.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm" variant="secondary" onClick={() => navigate('/symptoms')}>
              <Activity className="h-3.5 w-3.5 mr-1" /> Symptom Check
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/telemedicine')}>
              <Calendar className="h-3.5 w-3.5 mr-1" /> Book Doctor
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/prescriptions')}>
              <FileText className="h-3.5 w-3.5 mr-1" /> View Prescriptions
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Adherence Rate', value: '87%', icon: Heart, trend: '+3%', up: true, color: 'text-green-500' },
          { label: 'Active Reminders', value: '5', icon: Bell, trend: '2 today', up: true, color: 'text-primary' },
          { label: 'Risk Score', value: riskScore.toString(), icon: Activity, trend: '-5', up: false, color: riskScore < 40 ? 'text-green-500' : 'text-amber-500' },
          { label: 'Prescriptions', value: '3', icon: FileText, trend: '1 active', up: true, color: 'text-purple-500' },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div className={`flex items-center gap-0.5 text-xs ${stat.up ? 'text-green-500' : 'text-amber-500'}`}>
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
        <Card className="lg:col-span-2 rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medication Adherence (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="adherence" stroke="hsl(217, 91%, 53%)" fill="url(#adherenceGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Health Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(142, 71%, 45%)" strokeWidth="8"
                  strokeDasharray={`${(riskScore / 100) * 251.3} 251.3`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-bold">{riskScore}</span>
                <span className="text-xs text-muted-foreground">Low Risk</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
              <TrendingDown className="h-3.5 w-3.5" /> Improved by 5 points
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  className={`h-auto flex-col gap-2 p-4 rounded-xl ${action.color} hover:opacity-80`}
                  onClick={() => navigate(action.url)}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="link" size="sm" className="text-xs">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
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
      <Card className="rounded-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Symptom Frequency (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={symptomData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={12} width={80} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="hsl(217, 91%, 53%)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
