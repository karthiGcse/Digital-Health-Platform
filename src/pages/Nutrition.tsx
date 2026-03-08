import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Flame, Droplets, Wheat, Clock, Plus, RefreshCw } from 'lucide-react';

const mealPlan = [
  { meal: 'Breakfast', time: '8:00 AM', items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'], calories: 420, protein: 18, carbs: 55, fat: 12 },
  { meal: 'Lunch', time: '12:30 PM', items: ['Grilled chicken salad', 'Quinoa', 'Avocado dressing'], calories: 580, protein: 35, carbs: 42, fat: 22 },
  { meal: 'Snack', time: '3:30 PM', items: ['Mixed nuts', 'Apple slices'], calories: 220, protein: 6, carbs: 20, fat: 14 },
  { meal: 'Dinner', time: '7:00 PM', items: ['Baked salmon', 'Brown rice', 'Steamed broccoli'], calories: 650, protein: 40, carbs: 48, fat: 24 },
];

const Nutrition = () => {
  const [generating, setGenerating] = useState(false);
  const totalCalories = mealPlan.reduce((a, m) => a + m.calories, 0);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-success animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Apple className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Nutrition</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AI Nutrition & Diet Planner</h1>
          <p className="mt-1 text-white/75 text-sm">Personalized meal plans based on your health conditions and goals.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Daily Calories', value: `${totalCalories}`, icon: Flame, iconClass: 'stat-icon-orange' },
          { label: 'Protein', value: '99g', icon: Wheat, iconClass: 'stat-icon-green' },
          { label: 'Hydration', value: '2.1L', icon: Droplets, iconClass: 'stat-icon-blue' },
          { label: 'Meals Today', value: '4', icon: Clock, iconClass: 'stat-icon-purple' },
        ].map(s => (
          <Card key={s.label} className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className={s.iconClass}><s.icon className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today's Meal Plan</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setGenerating(!generating)}>
              <RefreshCw className={`h-3 w-3 mr-1 ${generating ? 'animate-spin' : ''}`} /> Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mealPlan.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <div><h4 className="font-semibold text-sm">{m.meal}</h4><p className="text-xs text-muted-foreground">{m.time}</p></div>
                  <Badge variant="secondary">{m.calories} kcal</Badge>
                </div>
                <ul className="space-y-1 mb-3">{m.items.map((item, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-success" />{item}</li>
                ))}</ul>
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">Protein: <strong>{m.protein}g</strong></span>
                  <span className="text-muted-foreground">Carbs: <strong>{m.carbs}g</strong></span>
                  <span className="text-muted-foreground">Fat: <strong>{m.fat}g</strong></span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Nutrition;
