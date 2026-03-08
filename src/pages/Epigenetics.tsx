import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna, Activity, TrendingUp, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const methylationData = [
  { gene: 'MTHFR', score: 72 }, { gene: 'COMT', score: 85 }, { gene: 'BDNF', score: 60 },
  { gene: 'NRF2', score: 90 }, { gene: 'FOXO3', score: 45 },
];

const Epigenetics = () => (
  <div className="space-y-6">
    <div className="page-header gradient-health animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Dna className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Epigenetics</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Epigenetics Tracker</h1>
        <p className="mt-1 text-white/75 text-sm">Track how lifestyle changes affect your gene expression.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Dna className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">72%</p><p className="text-xs text-muted-foreground">Methylation Score</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">+8%</p><p className="text-xs text-muted-foreground">Improvement</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Brain className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">5</p><p className="text-xs text-muted-foreground">Genes Tracked</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Gene Methylation Scores</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={methylationData}>
            <XAxis dataKey="gene" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Bar dataKey="score" fill="hsl(217, 91%, 53%)" radius={[8, 8, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default Epigenetics;
