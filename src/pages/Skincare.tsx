import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, Camera, Sun, Sparkles, ShoppingBag } from 'lucide-react';

const routine = [
  { step: 'Cleanser', product: 'Gentle Foam Cleanser', time: 'Morning & Night', done: true },
  { step: 'Toner', product: 'Hydrating Toner with HA', time: 'Morning & Night', done: true },
  { step: 'Serum', product: 'Vitamin C Brightening Serum', time: 'Morning', done: false },
  { step: 'Moisturizer', product: 'Lightweight Gel Moisturizer', time: 'Morning & Night', done: false },
  { step: 'Sunscreen', product: 'SPF 50+ Broad Spectrum', time: 'Morning', done: false },
];

const Skincare = () => {
  const [completed, setCompleted] = useState(new Set([0, 1]));

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><Droplets className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Skincare</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Skin Care AI Advisor</h1>
          <p className="mt-1 text-white/75 text-sm">Personalized skincare routines based on AI skin analysis.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Droplets className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">Oily</p><p className="text-xs text-muted-foreground">Skin Type</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Sun className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">High</p><p className="text-xs text-muted-foreground">UV Index Today</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Sparkles className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">78/100</p><p className="text-xs text-muted-foreground">Skin Score</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Morning Routine</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routine.map((r, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${completed.has(i) ? 'bg-success/10' : 'bg-muted/50'}`}>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant={completed.has(i) ? 'default' : 'outline'} className={completed.has(i) ? 'bg-success hover:bg-success/90' : ''} onClick={() => setCompleted(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                    {completed.has(i) ? '✓' : i + 1}
                  </Button>
                  <div><p className={`font-medium text-sm ${completed.has(i) ? 'line-through text-muted-foreground' : ''}`}>{r.step}: {r.product}</p><p className="text-xs text-muted-foreground">{r.time}</p></div>
                </div>
                <Button size="sm" variant="ghost"><ShoppingBag className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Skincare;
