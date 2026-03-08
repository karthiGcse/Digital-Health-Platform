import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HeartPulse, Activity, TrendingDown, AlertTriangle, CheckCircle2, Stethoscope } from 'lucide-react';

const riskFactors = [
  { name: 'Blood Pressure', value: '128/82 mmHg', status: 'borderline', score: 35 },
  { name: 'Cholesterol (LDL)', value: '142 mg/dL', status: 'elevated', score: 55 },
  { name: 'BMI', value: '26.4', status: 'borderline', score: 30 },
  { name: 'Blood Sugar', value: '98 mg/dL', status: 'normal', score: 10 },
  { name: 'Smoking', value: 'Non-smoker', status: 'normal', score: 0 },
  { name: 'Physical Activity', value: '3x/week', status: 'good', score: 15 },
];

const CardiacRisk = () => {
  const overallRisk = 22;

  return (
    <div className="space-y-6">
      <div className="page-header gradient-danger animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <HeartPulse className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Cardiac Risk</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Cardiac Risk Predictor</h1>
          <p className="mt-1 text-white/75 text-sm">AI-powered heart disease risk assessment with 10-year scoring.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader><CardTitle className="text-base">10-Year Risk Score</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={overallRisk < 30 ? 'hsl(152, 76%, 42%)' : 'hsl(38, 92%, 50%)'} strokeWidth="8"
                  strokeDasharray={`${(overallRisk / 100) * 251.3} 251.3`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-heading font-bold">{overallRisk}%</span>
                <span className="text-xs text-success font-medium">Low Risk</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center">Your 10-year cardiovascular risk is below average for your age group.</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader><CardTitle className="text-base">Risk Factors</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {f.status === 'normal' || f.status === 'good' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                    <span className="text-sm">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{f.value}</span>
                    <Badge variant={f.status === 'normal' || f.status === 'good' ? 'default' : 'secondary'} className="text-[10px]">{f.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lifestyle Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Reduce Sodium', desc: 'Limit daily sodium to under 2,300mg to help lower blood pressure.' },
              { title: 'Increase Omega-3', desc: 'Add fatty fish 2-3 times per week to improve cholesterol levels.' },
              { title: 'Daily Walking', desc: '30 minutes of brisk walking daily can reduce cardiac risk by 20%.' },
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50">
                <h4 className="font-semibold text-sm mb-1">{r.title}</h4>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardiacRisk;
