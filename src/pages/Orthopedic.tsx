import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bone, Activity, AlertTriangle, CheckCircle2, Camera } from 'lucide-react';

const assessments = [
  { joint: 'Right Knee', condition: 'Mild osteoarthritis', risk: 'Low', lastCheck: '2026-02-20' },
  { joint: 'Lower Back', condition: 'Postural strain', risk: 'Medium', lastCheck: '2026-03-01' },
  { joint: 'Left Shoulder', condition: 'Normal', risk: 'None', lastCheck: '2026-02-28' },
];

const Orthopedic = () => (
  <div className="space-y-6">
    <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Bone className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Orthopedic</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Orthopedic AI Assistant</h1>
        <p className="mt-1 text-white/75 text-sm">AI-powered bone and joint health assessment with posture analysis.</p>
      </div>
    </div>

    <Card>
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center">
          <Camera className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-1">Posture Analysis</h3>
          <p className="text-xs text-muted-foreground mb-3">Stand in front of your camera for AI posture assessment</p>
          <Button className="gradient-warm text-white"><Camera className="h-4 w-4 mr-2" /> Start Analysis</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">Joint Health Assessment</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assessments.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={a.risk === 'None' ? 'stat-icon-green' : a.risk === 'Low' ? 'stat-icon-blue' : 'stat-icon-orange'}><Bone className="h-4 w-4" /></div>
                <div><p className="font-medium text-sm">{a.joint}</p><p className="text-xs text-muted-foreground">{a.condition}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.risk === 'None' ? 'default' : 'secondary'}>{a.risk} Risk</Badge>
                <span className="text-xs text-muted-foreground">{a.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Orthopedic;
