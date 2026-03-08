import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';

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
  slots: (HistoryItem | null)[];
  onRemoveSlot: (index: number) => void;
}

const ComparisonSlot = ({ item, index, onRemove }: { item: HistoryItem | null; index: number; onRemove: () => void }) => {
  if (!item) {
    return (
      <div className="flex-1 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ArrowLeftRight className="h-6 w-6 mb-2 opacity-40" />
        <p className="text-sm font-medium">Slot {index + 1}</p>
        <p className="text-xs mt-0.5">Select from history</p>
      </div>
    );
  }

  return (
    <Card className="flex-1 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="text-[10px]">Slot {index + 1}</Badge>
          <button onClick={onRemove} className="p-1 rounded hover:bg-muted"><X className="h-3 w-3" /></button>
        </div>
        {item.image_url ? (
          <img src={item.image_url} alt="Comparison" className="w-full h-40 object-contain rounded-lg bg-muted/20" />
        ) : (
          <div className="w-full h-40 rounded-lg bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">No image</div>
        )}
        <div>
          <p className="font-semibold text-sm">{item.condition_name || 'Analysis'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(item.created_at), 'MMM d, yyyy')}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {item.condition_type && <Badge variant="outline" className="text-[10px]">{item.condition_type}</Badge>}
          {item.confidence && <Badge variant="outline" className="text-[10px]">{item.confidence} conf.</Badge>}
          {item.urgency && <Badge variant="outline" className="text-[10px]">{item.urgency} urg.</Badge>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-4">{item.diagnosis}</p>
      </CardContent>
    </Card>
  );
};

const ComparisonView = ({ slots, onRemoveSlot }: Props) => (
  <div className="space-y-3">
    <p className="text-xs text-muted-foreground">Select two diagnoses from the History tab to compare them side-by-side.</p>
    <div className="flex gap-4">
      <ComparisonSlot item={slots[0]} index={0} onRemove={() => onRemoveSlot(0)} />
      <ComparisonSlot item={slots[1]} index={1} onRemove={() => onRemoveSlot(1)} />
    </div>
  </div>
);

export default ComparisonView;
