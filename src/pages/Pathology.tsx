import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, Upload, FileText, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

const reports = [
  { name: 'Complete Blood Count', date: '2026-03-01', status: 'Normal', highlights: [
    { test: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5', status: 'normal' },
    { test: 'WBC Count', value: '7,200 /μL', range: '4,500-11,000', status: 'normal' },
    { test: 'Platelet Count', value: '245,000 /μL', range: '150,000-400,000', status: 'normal' },
  ]},
  { name: 'Lipid Panel', date: '2026-02-15', status: 'Attention', highlights: [
    { test: 'Total Cholesterol', value: '220 mg/dL', range: '<200', status: 'high' },
    { test: 'HDL', value: '55 mg/dL', range: '>40', status: 'normal' },
    { test: 'LDL', value: '142 mg/dL', range: '<100', status: 'high' },
  ]},
];

const Pathology = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <TestTube className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Pathology</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AI Pathology Report Analyzer</h1>
          <p className="mt-1 text-white/75 text-sm">Automated analysis and plain-language summaries of lab reports.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-heading font-semibold mb-1">Upload Lab Report</h3>
            <p className="text-xs text-muted-foreground mb-3">PDF, image, or text format</p>
            <Button className="gradient-warm text-white"><Upload className="h-4 w-4 mr-2" /> Upload Report</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Analyzed Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((r, i) => (
              <div key={i} className="rounded-xl border overflow-hidden">
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <div className={r.status === 'Normal' ? 'stat-icon-green' : 'stat-icon-orange'}><FileText className="h-4 w-4" /></div>
                    <div className="text-left"><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.date}</p></div>
                  </div>
                  <Badge variant={r.status === 'Normal' ? 'default' : 'destructive'}>{r.status}</Badge>
                </button>
                {expanded === i && (
                  <div className="px-4 pb-4 space-y-2">
                    {r.highlights.map((h, j) => (
                      <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">{h.test}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{h.value}</span>
                          <span className="text-xs text-muted-foreground">({h.range})</span>
                          {h.status === 'normal' ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pathology;
