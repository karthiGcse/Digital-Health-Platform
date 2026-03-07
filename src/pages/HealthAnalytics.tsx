import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Activity, Heart, TrendingUp, TrendingDown, Pill, AlertTriangle,
  Calendar, Clock, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = [
  'hsl(217, 91%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)',
  'hsl(271, 81%, 56%)', 'hsl(0, 84%, 60%)'
];

const HealthAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [symptomLogs, setSymptomLogs] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [sRes, rRes, pRes] = await Promise.all([
        supabase.from('symptom_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('reminders').select('*').eq('user_id', user.id),
        supabase.from('prescriptions').select('*').eq('user_id', user.id),
      ]);
      setSymptomLogs(sRes.data || []);
      setReminders(rRes.data || []);
      setPrescriptions(pRes.data || []);
    } catch { toast({ title: 'Error loading data', variant: 'destructive' }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  // Derived data
  const avgAdherence = reminders.length > 0
    ? Math.round(reminders.reduce((s, r) => s + (r.adherence_score || 0), 0) / reminders.length)
    : 0;

  const totalTaken = reminders.reduce((s, r) => s + (r.taken_count || 0), 0);
  const totalMissed = reminders.reduce((s, r) => s + (r.missed_count || 0), 0);

  const severityDistribution = symptomLogs.reduce((acc: Record<string, number>, log) => {
    const sev = (log.severity || 'mild').charAt(0).toUpperCase() + (log.severity || 'mild').slice(1);
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});
  const severityData = Object.entries(severityDistribution).map(([name, value]) => ({ name, value }));

  const riskTrend = symptomLogs.slice(-10).map((log, i) => ({
    check: `#${i + 1}`,
    score: log.risk_score || 0,
  }));

  const adherencePie = [
    { name: 'Taken', value: totalTaken },
    { name: 'Missed', value: totalMissed },
  ];

  const avgRisk = symptomLogs.length > 0
    ? Math.round(symptomLogs.reduce((s, l) => s + (l.risk_score || 0), 0) / symptomLogs.length)
    : 0;

  const stats = [
    { label: 'Avg Adherence', value: `${avgAdherence}%`, icon: Heart, color: 'text-success', trend: avgAdherence >= 80 ? 'Good' : 'Needs improvement' },
    { label: 'Symptom Checks', value: symptomLogs.length.toString(), icon: Activity, color: 'text-primary', trend: 'Total logged' },
    { label: 'Avg Risk Score', value: avgRisk.toString(), icon: AlertTriangle, color: avgRisk < 40 ? 'text-success' : 'text-warning', trend: avgRisk < 40 ? 'Low risk' : 'Moderate' },
    { label: 'Active Meds', value: reminders.filter(r => r.status === 'active').length.toString(), icon: Pill, color: 'text-primary', trend: `${prescriptions.length} prescriptions` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Health Analytics</h1>
          <p className="text-sm text-muted-foreground">Insights from your health data</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.trend}</span>
              </div>
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Risk Trend */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {riskTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={riskTrend}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(217, 91%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="check" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(217, 91%, 53%)" fill="url(#riskGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No symptom checks yet. Use the Symptom Checker to generate data.</p>
            )}
          </CardContent>
        </Card>

        {/* Adherence Pie */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Medication Adherence</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {totalTaken + totalMissed > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={adherencePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {adherencePie.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span>Taken ({totalTaken})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span>Missed ({totalMissed})</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No medication data yet. Add reminders to track adherence.</p>
            )}
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Symptom Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={severityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {severityData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No symptom data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Prescriptions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length > 0 ? (
              <div className="space-y-3">
                {prescriptions.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{p.diagnosis || 'Prescription'}</p>
                      <p className="text-xs text-muted-foreground">Dr. {p.prescribed_by || 'Unknown'} • {p.date}</p>
                    </div>
                    <Badge variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No prescriptions uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthAnalytics;
