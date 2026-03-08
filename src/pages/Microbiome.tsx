import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, Activity, TrendingUp, Pill } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const bacteriaData = [
  { name: 'Lactobacillus', count: 35 }, { name: 'Bifidobacterium', count: 28 },
  { name: 'Bacteroides', count: 18 }, { name: 'Firmicutes', count: 12 }, { name: 'Others', count: 7 },
];

const Microbiome = () => (
  <div className="space-y-6">
    <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Microscope className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Microbiome</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Microbiome Analysis</h1>
        <p className="mt-1 text-white/75 text-sm">Analyze gut health and microbiome composition with AI insights.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Activity className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">82/100</p><p className="text-xs text-muted-foreground">Gut Health Score</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Good</p><p className="text-xs text-muted-foreground">Diversity</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Pill className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Probiotics Recommended</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Gut Flora Composition</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={bacteriaData} layout="vertical">
            <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={12} width={110} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(152, 76%, 42%)" radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default Microbiome;
