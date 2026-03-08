import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Apple, Flame, Droplets, Wheat, Clock, Plus, RefreshCw, Trash2, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const defaultMealPlan = [
  { meal: 'Breakfast', time: '8:00 AM', items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'], calories: 420, protein: 18, carbs: 55, fat: 12 },
  { meal: 'Lunch', time: '12:30 PM', items: ['Grilled chicken salad', 'Quinoa', 'Avocado dressing'], calories: 580, protein: 35, carbs: 42, fat: 22 },
  { meal: 'Snack', time: '3:30 PM', items: ['Mixed nuts', 'Apple slices'], calories: 220, protein: 6, carbs: 20, fat: 14 },
  { meal: 'Dinner', time: '7:00 PM', items: ['Baked salmon', 'Brown rice', 'Steamed broccoli'], calories: 650, protein: 40, carbs: 48, fat: 24 },
];

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'snack', label: 'Snack' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'pre-workout', label: 'Pre-Workout' },
  { value: 'post-workout', label: 'Post-Workout' },
];

const Nutrition = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemInput, setItemInput] = useState('');
  const [formItems, setFormItems] = useState<string[]>([]);
  const [form, setForm] = useState({
    meal_name: '',
    meal_type: 'breakfast',
    meal_time: '08:00 AM',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: '',
  });

  // Fetch saved nutrition plans
  const { data: savedPlans = [], isLoading } = useQuery({
    queryKey: ['nutrition_plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add nutrition plan
  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not logged in');
      const { error } = await supabase.from('nutrition_plans').insert({
        user_id: user.id,
        meal_name: form.meal_name,
        meal_type: form.meal_type,
        meal_time: form.meal_time,
        items: formItems,
        calories: form.calories,
        protein: form.protein,
        carbs: form.carbs,
        fat: form.fat,
        notes: form.notes,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition_plans'] });
      toast.success('Nutrition plan added!');
      setDialogOpen(false);
      // Send notification
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: '🥗 Nutrition Plan Added',
          message: `Your meal "${form.meal_name}" (${form.calories} kcal) has been added to today's plan.`,
          type: 'success',
          link: '/nutrition',
        });
      }
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Delete nutrition plan
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('nutrition_plans').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition_plans'] });
      toast.success('Plan deleted');
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: '🗑️ Nutrition Plan Removed',
          message: 'A meal has been removed from your nutrition plan.',
          type: 'info',
          link: '/nutrition',
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetForm = () => {
    setForm({ meal_name: '', meal_type: 'breakfast', meal_time: '08:00 AM', calories: 0, protein: 0, carbs: 0, fat: 0, notes: '' });
    setFormItems([]);
    setItemInput('');
  };

  const addItem = () => {
    if (itemInput.trim()) {
      setFormItems([...formItems, itemInput.trim()]);
      setItemInput('');
    }
  };

  const allMeals = [
    ...savedPlans.map((p: any) => ({
      meal: p.meal_name,
      time: p.meal_time,
      items: Array.isArray(p.items) ? p.items as string[] : [],
      calories: p.calories,
      protein: p.protein,
      carbs: p.carbs,
      fat: p.fat,
      id: p.id,
      saved: true,
      type: p.meal_type,
    })),
    ...defaultMealPlan.map((m, i) => ({ ...m, id: `default-${i}`, saved: false, type: m.meal.toLowerCase() })),
  ];

  const totalCalories = allMeals.reduce((a, m) => a + m.calories, 0);
  const totalProtein = allMeals.reduce((a, m) => a + m.protein, 0);
  const totalCarbs = allMeals.reduce((a, m) => a + m.carbs, 0);

  const mealTypeColor: Record<string, string> = {
    breakfast: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    lunch: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    snack: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    dinner: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'pre-workout': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'post-workout': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Daily Calories', value: `${totalCalories}`, icon: Flame, iconClass: 'stat-icon-orange' },
          { label: 'Protein', value: `${totalProtein}g`, icon: Wheat, iconClass: 'stat-icon-green' },
          { label: 'Hydration', value: '2.1L', icon: Droplets, iconClass: 'stat-icon-blue' },
          { label: 'Meals Today', value: `${allMeals.length}`, icon: Clock, iconClass: 'stat-icon-purple' },
        ].map(s => (
          <Card key={s.label} className="card-hover">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={s.iconClass}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-heading font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Today's Meal Plan</CardTitle>
            <div className="flex gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-3 w-3" /> Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Nutrition Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Meal Name *</Label>
                      <Input
                        placeholder="e.g. Morning Power Bowl"
                        value={form.meal_name}
                        onChange={e => setForm({ ...form, meal_name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Meal Type</Label>
                        <Select value={form.meal_type} onValueChange={v => setForm({ ...form, meal_type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {mealTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          placeholder="8:00 AM"
                          value={form.meal_time}
                          onChange={e => setForm({ ...form, meal_time: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Food items */}
                    <div className="space-y-2">
                      <Label>Food Items</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add food item..."
                          value={itemInput}
                          onChange={e => setItemInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={addItem}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {formItems.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {formItems.map((item, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 pr-1">
                              {item}
                              <button onClick={() => setFormItems(formItems.filter((_, j) => j !== i))}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'calories', label: 'Calories (kcal)' },
                        { key: 'protein', label: 'Protein (g)' },
                        { key: 'carbs', label: 'Carbs (g)' },
                        { key: 'fat', label: 'Fat (g)' },
                      ].map(f => (
                        <div key={f.key} className="space-y-2">
                          <Label>{f.label}</Label>
                          <Input
                            type="number"
                            min={0}
                            value={(form as any)[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea
                        placeholder="Any dietary notes..."
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => addMutation.mutate()}
                      disabled={!form.meal_name.trim() || addMutation.isPending}
                    >
                      {addMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                      Add Nutrition Plan
                    </Button>

                    {!user && (
                      <p className="text-xs text-destructive text-center">Please log in to save nutrition plans.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="sm" variant="outline" onClick={() => setGenerating(!generating)}>
                <RefreshCw className={`h-3 w-3 mr-1 ${generating ? 'animate-spin' : ''}`} /> Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {allMeals.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-muted/50 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{m.meal}</h4>
                        <p className="text-xs text-muted-foreground">{m.time}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${mealTypeColor[m.type] || ''}`}>
                        {m.type}
                      </Badge>
                      {m.saved && (
                        <Badge className="text-[9px] bg-primary/15 text-primary border-primary/30" variant="outline">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{m.calories} kcal</Badge>
                      {m.saved && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {m.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-success" />{item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 text-xs">
                    <span className="text-muted-foreground">Protein: <strong>{m.protein}g</strong></span>
                    <span className="text-muted-foreground">Carbs: <strong>{m.carbs}g</strong></span>
                    <span className="text-muted-foreground">Fat: <strong>{m.fat}g</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Nutrition;
