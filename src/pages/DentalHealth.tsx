import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Camera, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

const dentalIssues = [
  { area: 'Upper Left Molar', issue: 'Possible cavity', severity: 'Medium', recommendation: 'Schedule dental visit within 2 weeks' },
  { area: 'Lower Gums', issue: 'Mild inflammation', severity: 'Low', recommendation: 'Improve flossing technique' },
];

const DentalHealth = () => {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><Smile className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Dental Health</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Dental Health AI Scanner</h1>
          <p className="mt-1 text-white/75 text-sm">Scan teeth and gums for early detection of dental issues.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center">
            <Camera className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">Scan Your Teeth</h3>
            <p className="text-sm text-muted-foreground mb-4">Take a clear photo of your teeth for AI analysis.</p>
            <Button className="gradient-cool text-white" onClick={() => setScanning(true)}>
              <Camera className="h-4 w-4 mr-2" /> Start Scan
            </Button>
            {scanning && <p className="text-sm text-primary mt-4 animate-pulse">Analyzing dental image...</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Findings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dentalIssues.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{d.area}</h4>
                  <Badge variant={d.severity === 'Medium' ? 'destructive' : 'secondary'}>{d.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{d.issue}</p>
                <p className="text-xs text-primary mt-2">💡 {d.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DentalHealth;
