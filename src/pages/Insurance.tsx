import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck, Scale, FileText, CheckCircle2, TrendingDown, Heart, Users,
  Baby, Stethoscope, AlertCircle, Calculator, Clock, ArrowRight, Star,
  Zap, Eye, Phone, Upload, IndianRupee, Activity, Shield, Sparkles
} from 'lucide-react';

const plans = [
  { name: 'Premium Health Shield', provider: 'LifeGuard Insurance', premium: '₹1,200/mo', coverage: '₹10L', score: 92, highlights: ['Cashless at 5000+ hospitals', 'Pre-existing diseases covered after 2 yrs', 'Free annual health check'], category: 'individual' },
  { name: 'Family Floater Plus', provider: 'SecureHealth', premium: '₹2,800/mo', coverage: '₹25L', score: 88, highlights: ['Family of 4 covered', 'Maternity benefits', 'No co-payment'], category: 'family' },
  { name: 'Senior Care Plan', provider: 'ElderShield Corp', premium: '₹3,500/mo', coverage: '₹15L', score: 76, highlights: ['Age 60+ eligible', 'Domiciliary treatment', 'Ambulance cover'], category: 'senior' },
  { name: 'Critical Illness Guard', provider: 'MaxProtect Health', premium: '₹900/mo', coverage: '₹20L', score: 85, highlights: ['Covers 36 critical illnesses', 'Lump sum payout', 'Worldwide coverage'], category: 'critical' },
  { name: 'Maternity Care Plus', provider: 'MomCare Insurance', premium: '₹1,800/mo', coverage: '₹8L', score: 82, highlights: ['Pre & post natal cover', 'Newborn baby cover', 'Fertility treatment'], category: 'maternity' },
  { name: 'Super Top-Up Plan', provider: 'ValueHealth Corp', premium: '₹450/mo', coverage: '₹50L', score: 90, highlights: ['Deductible: ₹5L', 'Affordable high cover', 'All pre-existing after 1 yr'], category: 'topup' },
];

const claimSteps = [
  { step: 1, title: 'Upload Documents', desc: 'Submit hospital bills & discharge summary', icon: Upload, status: 'done' as const },
  { step: 2, title: 'AI Verification', desc: 'Auto-verify claim eligibility & amounts', icon: Eye, status: 'done' as const },
  { step: 3, title: 'Insurer Review', desc: 'Under review by insurance provider', icon: Clock, status: 'active' as const },
  { step: 4, title: 'Settlement', desc: 'Claim amount credited to account', icon: IndianRupee, status: 'pending' as const },
];

const coverageAnalysis = [
  { area: 'Hospitalization', covered: 95, icon: Stethoscope },
  { area: 'OPD Expenses', covered: 40, icon: Activity },
  { area: 'Dental & Vision', covered: 20, icon: Eye },
  { area: 'Mental Health', covered: 60, icon: Heart },
  { area: 'Maternity', covered: 75, icon: Baby },
  { area: 'Critical Illness', covered: 85, icon: AlertCircle },
];

const quickTools = [
  { title: 'Premium Calculator', desc: 'Estimate your ideal premium', icon: Calculator, color: 'stat-icon-blue' },
  { title: 'Claim Status Tracker', desc: 'Track existing claims live', icon: Clock, color: 'stat-icon-green' },
  { title: 'Policy Comparison', desc: 'Side-by-side plan analysis', icon: Scale, color: 'stat-icon-purple' },
  { title: 'Network Hospitals', desc: 'Find cashless hospitals nearby', icon: Shield, color: 'stat-icon-orange' },
];

const Insurance = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlans = selectedCategory === 'all'
    ? plans
    : plans.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-health animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Insurance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Health Insurance Optimizer</h1>
          <p className="mt-1 text-white/75 text-sm">AI-powered insurance plan comparison, claim tracking & coverage analysis.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Scale className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{plans.length}</p><p className="text-xs text-muted-foreground">Plans Compared</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><TrendingDown className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹4,200</p><p className="text-xs text-muted-foreground">Potential Savings</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><FileText className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Active Claims</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Star className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">92%</p><p className="text-xs text-muted-foreground">Coverage Score</p></div></CardContent></Card>
      </div>

      {/* Quick Tools */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickTools.map((tool, i) => (
          <Card key={i} className="card-hover cursor-pointer group">
            <CardContent className="p-4 text-center space-y-2">
              <div className={`${tool.color} mx-auto`}><tool.icon className="h-5 w-5" /></div>
              <p className="font-medium text-sm">{tool.title}</p>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="plans">Plan Comparison</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
          <TabsTrigger value="claims">Claim Tracker</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Plans' },
              { key: 'individual', label: 'Individual' },
              { key: 'family', label: 'Family' },
              { key: 'senior', label: 'Senior' },
              { key: 'critical', label: 'Critical Illness' },
              { key: 'maternity', label: 'Maternity' },
              { key: 'topup', label: 'Top-Up' },
            ].map(cat => (
              <Badge
                key={cat.key}
                variant={selectedCategory === cat.key ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredPlans.map((p, i) => (
              <Card key={i} className={`card-hover ${i === 0 && selectedCategory === 'all' ? 'border-primary ring-1 ring-primary/20' : ''}`}>
                {i === 0 && selectedCategory === 'all' && (
                  <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground border-0">
                    <Sparkles className="h-3 w-3 mr-1" />Best Match
                  </Badge>
                )}
                <CardContent className="p-5 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading font-semibold">{p.name}</h4>
                      <p className="text-xs text-muted-foreground">{p.provider}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{p.score}% match</Badge>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-heading font-bold">{p.premium}</span>
                    <span className="text-sm text-muted-foreground">Cover: {p.coverage}</span>
                  </div>
                  <Progress value={p.score} className="h-1.5" />
                  <ul className="space-y-1">
                    {p.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant={i === 0 && selectedCategory === 'all' ? 'default' : 'outline'} size="sm">
                      Select Plan
                    </Button>
                    <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Coverage Analysis Tab */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Your Coverage Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coverageAnalysis.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${item.covered >= 80 ? 'bg-success/10 text-success' : item.covered >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.area}</span>
                      <span className={`font-semibold ${item.covered >= 80 ? 'text-success' : item.covered >= 50 ? 'text-warning' : 'text-destructive'}`}>
                        {item.covered}%
                      </span>
                    </div>
                    <Progress value={item.covered} className="h-2" />
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-2 mt-4">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-warning">Coverage Recommendation</p>
                  <p className="text-muted-foreground mt-0.5">Consider adding a dental & vision rider to improve your overall coverage from 63% to 78%.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Add Super Top-Up', desc: 'Get ₹50L additional cover for just ₹450/mo on top of your existing plan.', saving: '₹2,100/yr saved vs standalone' },
                { title: 'Switch to Family Floater', desc: 'Consolidate 3 individual policies into one family plan for better value.', saving: '₹6,800/yr saved' },
                { title: 'Claim Tax Benefit', desc: 'Your premiums qualify for ₹25,000 deduction under Section 80D.', saving: '₹7,500 tax saved' },
              ].map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/50 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.desc}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{rec.saving}</Badge>
                  </div>
                  <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Active Claim #CLM-2026-0847
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {claimSteps.map((s) => (
                  <div key={s.step} className="space-y-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                      s.status === 'done' ? 'bg-success/15 text-success' :
                      s.status === 'active' ? 'bg-primary/15 text-primary animate-pulse' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {s.status === 'done' ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <p className="text-xs font-medium">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-muted/50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Claim Amount: ₹1,45,000</p>
                  <p className="text-xs text-muted-foreground">Hospitalization • 5 days • Max Hospital, Mumbai</p>
                </div>
                <Badge variant="secondary">In Review</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Claim History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'CLM-2025-0612', amount: '₹78,500', type: 'OPD Treatment', date: 'Dec 2025', status: 'Settled' },
                { id: 'CLM-2025-0389', amount: '₹2,30,000', type: 'Surgery', date: 'Sep 2025', status: 'Settled' },
                { id: 'CLM-2025-0201', amount: '₹15,000', type: 'Diagnostic Tests', date: 'Jun 2025', status: 'Rejected' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{c.type}</p>
                    <p className="text-xs text-muted-foreground">{c.id} • {c.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{c.amount}</p>
                    <Badge variant={c.status === 'Settled' ? 'default' : 'destructive'} className="text-[10px]">
                      {c.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Insurance;
