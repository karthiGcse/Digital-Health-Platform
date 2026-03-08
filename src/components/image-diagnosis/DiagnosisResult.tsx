import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, FileDown, Scan } from 'lucide-react';
import { motion } from 'framer-motion';

const urgencyColors: Record<string, string> = {
  low: 'bg-success/10 text-success border-success/20',
  moderate: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  emergency: 'bg-destructive text-destructive-foreground',
};

const confidenceColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-success/10 text-success border-success/20',
};

export interface DiagnosisResultData {
  condition_name?: string;
  confidence?: string;
  description?: string;
  possible_conditions?: string[];
  recommendations?: string[];
  urgency?: string;
  when_to_see_doctor?: string;
}

interface Props {
  result: DiagnosisResultData | null;
  onExportPDF?: () => void;
}

const DiagnosisResultView = ({ result, onExportPDF }: Props) => {
  if (!result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
        <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Scan className="h-8 w-8" />
        </div>
        <p className="font-heading font-semibold">Upload an image to start</p>
        <p className="text-sm mt-1">AI will analyze and provide insights</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-heading font-bold text-lg">{result.condition_name || 'Analysis Result'}</h3>
            <div className="flex gap-2 flex-wrap">
              {result.confidence && (
                <Badge className={`text-xs border ${confidenceColors[result.confidence] || ''}`}>
                  {result.confidence} confidence
                </Badge>
              )}
              {result.urgency && (
                <Badge className={`text-xs border ${urgencyColors[result.urgency] || ''}`}>
                  {result.urgency} urgency
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>

          {result.possible_conditions && result.possible_conditions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold mb-2">Possible Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {result.possible_conditions.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Recommendations
              </h4>
              <ul className="space-y-1.5">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="h-4 w-4 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] text-success">✓</span>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.when_to_see_doctor && (
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/10">
              <h4 className="text-xs font-bold mb-1 text-warning flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> When to See a Doctor
              </h4>
              <p className="text-xs text-muted-foreground">{result.when_to_see_doctor}</p>
            </div>
          )}

          {onExportPDF && (
            <Button variant="outline" size="sm" className="w-full gap-2 mt-2" onClick={onExportPDF}>
              <FileDown className="h-4 w-4" /> Export as PDF Report
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DiagnosisResultView;
