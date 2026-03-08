import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const lungData = [
  { month: 'Oct', fev1: 82 }, { month: 'Nov', fev1: 85 }, { month: 'Dec', fev1: 78 },
  { month: 'Jan', fev1: 80 }, { month: 'Feb', fev1: 88 }, { month: 'Mar', fev1: 86 },
];

const Respiratory = () => (
  <div className="space-y-6">
    <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Wind className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Respiratory</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Respiratory Health AI</h1>
        <p className="mt-1 text-white/75 text-sm">AI-powered lung health monitoring using breath analysis.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">86%</p><p className="text-xs text-muted-foreground">FEV1 Score</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Activity className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Good</p><p className="text-xs text-muted-foreground">Air Quality</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Wind className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Low</p><p className="text-xs text-muted-foreground">Asthma Risk</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Lung Function Trend (FEV1%)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={lungData}>
            <defs><linearGradient id="lungGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(152, 76%, 42%)" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(152, 76%, 42%)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="fev1" stroke="hsl(152, 76%, 42%)" fill="url(#lungGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default Respiratory;
