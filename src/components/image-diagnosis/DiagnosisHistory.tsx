import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  created_at: string;
  diagnosis: string | null;
  confidence: string | null;
  condition_type: string | null;
  image_url: string | null;
  condition_name: string | null;
  urgency: string | null;
}

interface Props {
  onSelectForCompare: (item: HistoryItem) => void;
  compareSlots: (HistoryItem | null)[];
  refreshKey: number;
}

const DiagnosisHistory = ({ onSelectForCompare, compareSlots, refreshKey }: Props) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('image_diagnoses')
      .select('id, created_at, diagnosis, confidence, condition_type, image_url, condition_name, urgency')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory((data as HistoryItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [user, refreshKey]);

  const deleteItem = async (id: string) => {
    await supabase.from('image_diagnoses').delete().eq('id', id);
    setHistory(prev => prev.filter(h => h.id !== id));
    toast.success('Diagnosis removed');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Clock className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-heading font-semibold">No diagnoses yet</p>
        <p className="text-sm mt-1">Your analysis history will appear here</p>
      </div>
    );
  }

  const isSelected = (id: string) => compareSlots.some(s => s?.id === id);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Click "Compare" to add items to the side-by-side comparison tool.</p>
      <AnimatePresence>
        {history.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`transition-all ${isSelected(item.id) ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4 flex gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt="Diagnosis" className="h-16 w-16 rounded-lg object-cover shrink-0 bg-muted" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted/40 shrink-0 flex items-center justify-center text-muted-foreground text-xs">No img</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm truncate">{item.condition_name || item.diagnosis?.slice(0, 40) || 'Analysis'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {item.condition_type && <Badge variant="secondary" className="text-[10px]">{item.condition_type}</Badge>}
                      {item.confidence && <Badge variant="outline" className="text-[10px]">{item.confidence}</Badge>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.diagnosis}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant={isSelected(item.id) ? 'default' : 'outline'} className="h-7 text-xs px-3"
                      onClick={() => onSelectForCompare(item)}>
                      {isSelected(item.id) ? 'Selected' : 'Compare'}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-destructive hover:text-destructive"
                      onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DiagnosisHistory;
