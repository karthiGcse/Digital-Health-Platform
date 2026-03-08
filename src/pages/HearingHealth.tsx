import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ear, Volume2, VolumeX, Activity, AlertTriangle } from 'lucide-react';

const testResults = [
  { frequency: '250 Hz', leftEar: 20, rightEar: 15, status: 'Normal' },
  { frequency: '500 Hz', leftEar: 25, rightEar: 20, status: 'Normal' },
  { frequency: '1000 Hz', leftEar: 15, rightEar: 15, status: 'Normal' },
  { frequency: '2000 Hz', leftEar: 30, rightEar: 25, status: 'Mild' },
  { frequency: '4000 Hz', leftEar: 35, rightEar: 40, status: 'Mild' },
];

const HearingHealth = () => (
  <div className="space-y-6">
    <div className="page-header gradient-warm animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Ear className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Hearing Health</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Hearing Health Monitor</h1>
        <p className="mt-1 text-white/75 text-sm">Track hearing health and detect early hearing loss.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Volume2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Good</p><p className="text-xs text-muted-foreground">Overall Hearing</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Activity className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">68 dB</p><p className="text-xs text-muted-foreground">Avg Exposure Today</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Ear className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Mar 1</p><p className="text-xs text-muted-foreground">Last Test</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Audiometry Results</CardTitle>
          <Button size="sm" className="gradient-warm text-white"><Volume2 className="h-3 w-3 mr-1" /> Start Test</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left p-2 text-muted-foreground text-xs">Frequency</th><th className="text-center p-2 text-muted-foreground text-xs">Left Ear (dB)</th><th className="text-center p-2 text-muted-foreground text-xs">Right Ear (dB)</th><th className="text-right p-2 text-muted-foreground text-xs">Status</th></tr></thead>
            <tbody>
              {testResults.map((t, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-2 font-medium">{t.frequency}</td>
                  <td className="p-2 text-center">{t.leftEar}</td>
                  <td className="p-2 text-center">{t.rightEar}</td>
                  <td className="p-2 text-right"><Badge variant={t.status === 'Normal' ? 'default' : 'secondary'}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default HearingHealth;
