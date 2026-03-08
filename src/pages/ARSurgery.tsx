import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Glasses, Brain, Eye, Play } from 'lucide-react';

const simulations = [
  { title: 'Knee Replacement', organ: 'Right Knee', surgeon: 'Dr. Patel', date: '2026-03-15', status: 'Ready' },
  { title: 'Cardiac Bypass Planning', organ: 'Heart', surgeon: 'Dr. Kumar', date: '2026-03-20', status: 'In Progress' },
  { title: 'Spinal Fusion Preview', organ: 'Lumbar Spine', surgeon: 'Dr. Mehta', date: '2026-04-01', status: 'Scheduled' },
];

const ARSurgery = () => (
  <div className="space-y-6">
    <div className="page-header gradient-health animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Glasses className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">AR Surgery</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AR Surgery Visualization</h1>
        <p className="mt-1 text-white/75 text-sm">Augmented reality surgical planning with 3D organ mapping.</p>
      </div>
    </div>

    <Card>
      <CardContent className="p-8">
        <div className="h-64 rounded-xl bg-muted/50 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-heading font-semibold mb-1">3D AR Viewer</p>
            <p className="text-xs text-muted-foreground mb-3">Select a simulation to view in augmented reality</p>
            <Button className="gradient-health text-white"><Eye className="h-4 w-4 mr-2" /> Launch AR View</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base">Surgery Simulations</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {simulations.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div><p className="font-medium text-sm">{s.title}</p><p className="text-xs text-muted-foreground">{s.organ} • {s.surgeon} • {s.date}</p></div>
              <div className="flex items-center gap-2">
                <Badge variant={s.status === 'Ready' ? 'default' : 'secondary'}>{s.status}</Badge>
                <Button size="sm" variant="outline"><Play className="h-3 w-3 mr-1" /> View</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ARSurgery;
