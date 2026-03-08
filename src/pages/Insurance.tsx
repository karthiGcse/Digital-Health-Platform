import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Scale, FileText, CheckCircle2, TrendingDown } from 'lucide-react';

const plans = [
  { name: 'Premium Health Shield', provider: 'LifeGuard Insurance', premium: '₹1,200/mo', coverage: '₹10L', score: 92, highlights: ['Cashless at 5000+ hospitals', 'Pre-existing diseases covered after 2 yrs', 'Free annual health check'] },
  { name: 'Family Floater Plus', provider: 'SecureHealth', premium: '₹2,800/mo', coverage: '₹25L', score: 88, highlights: ['Family of 4 covered', 'Maternity benefits', 'No co-payment'] },
  { name: 'Senior Care Plan', provider: 'ElderShield Corp', premium: '₹3,500/mo', coverage: '₹15L', score: 76, highlights: ['Age 60+ eligible', 'Domiciliary treatment', 'Ambulance cover'] },
];

const Insurance = () => (
  <div className="space-y-6">
    <div className="page-header gradient-health animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><ShieldCheck className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Insurance</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Health Insurance Optimizer</h1>
        <p className="mt-1 text-white/75 text-sm">AI-powered insurance plan comparison and claim assistance.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Scale className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{plans.length}</p><p className="text-xs text-muted-foreground">Plans Compared</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><TrendingDown className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹4,200</p><p className="text-xs text-muted-foreground">Potential Savings</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><FileText className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Active Claims</p></div></CardContent></Card>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      {plans.map((p, i) => (
        <Card key={i} className={`card-hover ${i === 0 ? 'border-primary ring-1 ring-primary/20' : ''}`}>
          {i === 0 && <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground border-0">Best Match</Badge>}
          <CardContent className="p-5 space-y-3 relative">
            <div>
              <h4 className="font-heading font-semibold">{p.name}</h4>
              <p className="text-xs text-muted-foreground">{p.provider}</p>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-heading font-bold">{p.premium}</span>
              <span className="text-sm text-muted-foreground">Cover: {p.coverage}</span>
            </div>
            <ul className="space-y-1">{p.highlights.map((h, j) => (
              <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" />{h}</li>
            ))}</ul>
            <Button className="w-full" variant={i === 0 ? 'default' : 'outline'}>Select Plan</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Insurance;
