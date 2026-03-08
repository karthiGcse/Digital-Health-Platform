import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, Dna, Pill, AlertTriangle, CheckCircle2 } from 'lucide-react';

const drugResponses = [
  { drug: 'Metformin', gene: 'SLC22A1', response: 'Normal Metabolizer', efficacy: 'High', risk: 'Low' },
  { drug: 'Warfarin', gene: 'CYP2C9/VKORC1', response: 'Intermediate Metabolizer', efficacy: 'Moderate', risk: 'Medium' },
  { drug: 'Clopidogrel', gene: 'CYP2C19', response: 'Poor Metabolizer', efficacy: 'Low', risk: 'High' },
  { drug: 'Codeine', gene: 'CYP2D6', response: 'Ultra-rapid Metabolizer', efficacy: 'High', risk: 'High' },
  { drug: 'Simvastatin', gene: 'SLCO1B1', response: 'Normal Metabolizer', efficacy: 'High', risk: 'Low' },
];

const Pharmacogenomics = () => (
  <div className="space-y-6">
    <div className="page-header gradient-health animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><TestTube className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Pharmacogenomics</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Pharmacogenomics</h1>
        <p className="mt-1 text-white/75 text-sm">Predict drug responses based on your genetic profile.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Dna className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">5</p><p className="text-xs text-muted-foreground">Genes Analyzed</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Pill className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">5</p><p className="text-xs text-muted-foreground">Drugs Profiled</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><AlertTriangle className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Alerts</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Drug-Gene Interactions</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {drugResponses.map((d, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{d.drug}</h4>
                  <p className="text-xs text-muted-foreground">Gene: {d.gene}</p>
                </div>
                <Badge variant={d.risk === 'Low' ? 'default' : d.risk === 'Medium' ? 'secondary' : 'destructive'}>{d.risk} Risk</Badge>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="text-muted-foreground">Response: <strong>{d.response}</strong></span>
                <span className="text-muted-foreground">Efficacy: <strong>{d.efficacy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Pharmacogenomics;
