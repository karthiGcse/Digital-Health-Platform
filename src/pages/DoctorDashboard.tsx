import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, BedDouble, FileText, Clock, Activity, Bell,
  Calendar, Stethoscope, ArrowRight, TrendingUp, AlertCircle,
  CheckCircle2, Loader2, Pill
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const mockStats = {
  todayPatients: 24,
  activeBeds: 18,
  pendingPrescriptions: 7,
  avgWaitTime: '12 min',
};

const recentPatients = [
  { id: 'PT-2025-0001', name: 'Rahul Sharma', age: 45, status: 'In Progress', symptoms: 'Chest pain, fatigue', time: '10:30 AM' },
  { id: 'PT-2025-0002', name: 'Priya Patel', age: 32, status: 'Waiting', symptoms: 'Headache, fever', time: '10:45 AM' },
  { id: 'PT-2025-0003', name: 'Amit Kumar', age: 58, status: 'Waiting', symptoms: 'Joint pain', time: '11:00 AM' },
  { id: 'PT-2025-0004', name: 'Sneha Gupta', age: 27, status: 'Completed', symptoms: 'Skin rash', time: '09:15 AM' },
  { id: 'PT-2025-0005', name: 'Vikram Singh', age: 63, status: 'Waiting', symptoms: 'Breathing difficulty', time: '11:15 AM' },
];

const recentNotifications = [
  { text: 'New patient registered: Vikram Singh', time: '2 min ago', type: 'info' },
  { text: 'Lab results ready for Rahul Sharma', time: '15 min ago', type: 'success' },
  { text: 'ICU bed occupancy at 85%', time: '30 min ago', type: 'warning' },
  { text: 'Prescription sent to pharmacy for Sneha Gupta', time: '1 hr ago', type: 'info' },
];

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    { label: "Today's Patients", value: mockStats.todayPatients, icon: Users, gradient: 'from-blue-500 to-cyan-500', trend: '+3 from yesterday' },
    { label: 'Active Beds', value: mockStats.activeBeds, icon: BedDouble, gradient: 'from-emerald-500 to-teal-500', trend: '72% occupancy' },
    { label: 'Pending Rx', value: mockStats.pendingPrescriptions, icon: FileText, gradient: 'from-violet-500 to-purple-500', trend: '3 urgent' },
    { label: 'Avg Wait Time', value: mockStats.avgWaitTime, icon: Clock, gradient: 'from-amber-500 to-orange-500', trend: '-2 min vs avg' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome, Dr. {profile?.name || 'Doctor'} 👋
                </h1>
                <p className="text-white/50 text-sm">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {' • '}
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20" onClick={() => navigate('/patient-registration')}>
              <Users className="h-4 w-4 mr-2" /> Register Patient
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white" onClick={() => navigate('/doctor-queue')}>
              <Activity className="h-4 w-4 mr-2" /> View Queue
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:shadow-lg transition-all border-border/50 bg-card/90 backdrop-blur-sm">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-[10px] text-emerald-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Queue */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> Today's Patient Queue
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => navigate('/doctor-queue')}>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.id} • Age {p.age} • {p.symptoms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{p.time}</span>
                      <Badge variant={p.status === 'Completed' ? 'default' : p.status === 'In Progress' ? 'secondary' : 'outline'}
                        className={p.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20' :
                          p.status === 'In Progress' ? 'bg-blue-500/15 text-blue-600 border-blue-500/20' :
                          'bg-amber-500/15 text-amber-600 border-amber-500/20'}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications + Quick Actions */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <div>
                      <p className="text-xs text-foreground">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: 'Register', icon: Users, route: '/patient-registration', color: 'from-blue-500 to-cyan-500' },
                { label: 'Beds', icon: BedDouble, route: '/bed-management', color: 'from-emerald-500 to-teal-500' },
                { label: 'Pharmacy', icon: Pill, route: '/smart-pharmacy', color: 'from-violet-500 to-purple-500' },
                { label: 'AI Assist', icon: Activity, route: '/ai-assistant', color: 'from-amber-500 to-orange-500' },
              ].map((a) => (
                <Button key={a.label} variant="outline" className="h-16 flex-col gap-1 hover:shadow-md transition-all" onClick={() => navigate(a.route)}>
                  <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                    <a.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium">{a.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
