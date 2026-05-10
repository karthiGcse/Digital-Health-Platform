import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, FileText, Clock, Activity, Bell,
  Stethoscope, ArrowRight, TrendingUp, Pill, RefreshCw,
  Hash, AlertCircle, CheckCircle2, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useHospitalDB, HospitalTokenDB } from '@/hooks/useHospitalDB';
import { supabase } from '@/integrations/supabase/client';

interface RecentVisit {
  id: string;
  patient_id: string;
  diagnosis: string;
  prescription: any[];
  completed_at: string | null;
  created_at: string;
}

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { getTodayTokens, getOrdersByType } = useHospitalDB();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tokens, setTokens] = useState<HospitalTokenDB[]>([]);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
    const channel = supabase
      .channel('doctor-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_tokens' }, () => loadDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_orders' }, () => loadDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_visits' }, () => loadDashboardData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadDashboardData = async () => {
    try {
      const todayTokens = await getTodayTokens();
      setTokens(todayTokens);
      const pharmacyOrders = await getOrdersByType('pharmacy');
      setPharmacyCount(pharmacyOrders.length);

      const today = new Date().toISOString().split('T')[0];
      const { data: visits } = await supabase
        .from('hospital_visits')
        .select('id, patient_id, diagnosis, prescription, completed_at, created_at')
        .gte('created_at', today)
        .order('created_at', { ascending: false })
        .limit(6);
      if (visits) setRecentVisits(visits as RecentVisit[]);

      const ids = [...new Set([...todayTokens.map(t => t.patient_id), ...(visits || []).map((v: any) => v.patient_id)])];
      if (ids.length) {
        const { data: pats } = await supabase.from('hospital_patients').select('id, name').in('id', ids);
        if (pats) {
          const map: Record<string, string> = {};
          pats.forEach((p: any) => { map[p.id] = p.name; });
          setPatientNames(map);
        }
      }
    } catch (e) { console.error(e); }
  };

  const waitingCount = tokens.filter(t => ['registered', 'waiting'].includes(t.status)).length;
  const inProgress = tokens.filter(t => t.status === 'with_doctor').length;
  const completed = tokens.filter(t => t.status === 'completed').length;
  const emergencyCount = tokens.filter(t => t.is_emergency && t.status !== 'completed').length;
  const activeConsult = tokens.find(t => t.status === 'with_doctor');
  const prescriptionsToday = recentVisits.filter(v => Array.isArray(v.prescription) && v.prescription.length > 0);

  const statCards = [
    { label: "Today's Patients", value: tokens.length, icon: Users, gradient: 'from-blue-500 to-cyan-500', trend: `${waitingCount} waiting` },
    { label: 'With Doctor', value: inProgress, icon: Stethoscope, gradient: 'from-violet-500 to-purple-500', trend: `${completed} completed` },
    { label: 'Pharmacy Queue', value: pharmacyCount, icon: Pill, gradient: 'from-emerald-500 to-teal-500', trend: 'pending orders' },
    { label: 'Emergency', value: emergencyCount, icon: AlertCircle, gradient: 'from-red-500 to-rose-500', trend: 'active emergencies' },
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

      {/* Active Consultation Banner */}
      {activeConsult && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold animate-pulse">
                  #{activeConsult.token_number}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Active Consultation</p>
                  <p className="text-sm font-bold">{patientNames[activeConsult.patient_id] || 'Patient'}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[400px]">{activeConsult.symptoms || 'No symptoms recorded'}</p>
                </div>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white" onClick={() => navigate('/doctor-queue')}>
                Continue Consultation <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
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

      {/* Quick Actions & Queue Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> Patient Queue
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={loadDashboardData}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tokens.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No patients today.</p>
                    <Button size="sm" variant="link" onClick={() => navigate('/patient-registration')}>Register first patient →</Button>
                  </div>
                ) : (
                  [...tokens]
                    .sort((a, b) => {
                      if (a.is_emergency && !b.is_emergency) return -1;
                      if (!a.is_emergency && b.is_emergency) return 1;
                      return a.token_number - b.token_number;
                    })
                    .slice(0, 8)
                    .map((t) => (
                    <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer
                      ${t.is_emergency ? 'bg-red-500/5 border border-red-500/20' : 'bg-muted/50 hover:bg-muted/80'}`}
                      onClick={() => navigate('/doctor-queue')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm
                          ${t.is_emergency ? 'bg-gradient-to-br from-red-500 to-rose-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                          #{t.token_number}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            Token #{t.token_number}
                            {t.is_emergency && <span className="text-[10px] text-red-500">🚨</span>}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{t.symptoms || 'No symptoms'}</p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${
                        t.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                        t.status === 'with_doctor' ? 'bg-blue-500/15 text-blue-600' :
                        t.status === 'at_pharmacy' ? 'bg-violet-500/15 text-violet-600' :
                        'bg-amber-500/15 text-amber-600'
                      }`}>{t.status.replace(/_/g, ' ')}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { label: 'Register', icon: Users, route: '/patient-registration', color: 'from-blue-500 to-cyan-500' },
                { label: 'Queue', icon: Stethoscope, route: '/doctor-queue', color: 'from-violet-500 to-purple-500' },
                { label: 'Pharmacy', icon: Pill, route: '/smart-pharmacy', color: 'from-emerald-500 to-teal-500' },
                { label: 'Scan Centre', icon: Activity, route: '/scan-centre', color: 'from-amber-500 to-orange-500' },
                { label: 'Lab Centre', icon: Package, route: '/lab-centre', color: 'from-cyan-500 to-blue-500' },
                { label: 'Notifications', icon: Bell, route: '/patient-notifications', color: 'from-pink-500 to-rose-500' },
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

      {/* Recent Prescriptions Today */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" /> Prescriptions Issued Today
          </CardTitle>
          <Badge variant="outline" className="text-xs">{prescriptionsToday.length} total</Badge>
        </CardHeader>
        <CardContent>
          {prescriptionsToday.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No prescriptions issued yet today.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prescriptionsToday.map(v => (
                <div key={v.id} className="p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold truncate">{patientNames[v.patient_id] || 'Patient'}</p>
                    <Badge className="bg-violet-500/15 text-violet-600 text-[10px] border-0">
                      {(v.prescription as any[]).length} med
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{v.diagnosis || 'No diagnosis recorded'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(v.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
