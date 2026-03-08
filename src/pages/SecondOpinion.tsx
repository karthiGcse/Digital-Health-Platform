import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Upload, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

const opinions = [
  { diagnosis: 'Type 2 Diabetes Management', specialists: 3, consensus: 'Agreed', date: '2026-03-01', recommendation: 'Continue current medication with dietary changes' },
  { diagnosis: 'Chronic Back Pain Assessment', specialists: 2, consensus: 'Partial', date: '2026-02-15', recommendation: 'Physical therapy recommended, surgery not advised yet' },
];

const SecondOpinion = () => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><Stethoscope className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Second Opinion</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AI Second Opinion</h1>
          <p className="mt-1 text-white/75 text-sm">Get AI-powered second opinions from global specialists.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-heading font-semibold mb-1">Submit for Second Opinion</h3>
            <p className="text-xs text-muted-foreground mb-3">Upload diagnosis reports, lab results, or medical records</p>
            <Button className="gradient-cool text-white" onClick={() => setSubmitting(true)}>
              <Upload className="h-4 w-4 mr-2" /> Upload Records
            </Button>
            {submitting && <p className="text-sm text-primary mt-4 animate-pulse">Consulting AI specialists...</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Previous Second Opinions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opinions.map((o, i) => (
              <div key={i} className="p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{o.diagnosis}</h4>
                  <Badge variant={o.consensus === 'Agreed' ? 'default' : 'secondary'}>{o.consensus}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{o.recommendation}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><MessageSquare className="h-3 w-3 inline" /> {o.specialists} specialists</span>
                  <span><Clock className="h-3 w-3 inline" /> {o.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecondOpinion;
