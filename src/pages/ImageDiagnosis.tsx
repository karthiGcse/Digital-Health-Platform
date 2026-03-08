import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Loader2, AlertTriangle, Eye, Scan, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const analysisTypes = [
  { value: 'skin', label: 'Skin Condition', icon: '🩹', desc: 'Rashes, moles, lesions, acne' },
  { value: 'eye', label: 'Eye Health', icon: '👁️', desc: 'Redness, swelling, discharge' },
  { value: 'wound', label: 'Wound Assessment', icon: '🩸', desc: 'Cuts, burns, infections' },
  { value: 'general', label: 'General', icon: '🔍', desc: 'Any visible health concern' },
];

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

interface DiagnosisResult {
  condition_name?: string;
  confidence?: string;
  description?: string;
  possible_conditions?: string[];
  recommendations?: string[];
  urgency?: string;
  when_to_see_doctor?: string;
}

const ImageDiagnosis = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-diagnosis', {
        body: { image_base64: imagePreview, analysis_type: analysisType },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);

      if (user) {
        await supabase.from('image_diagnoses').insert({
          user_id: user.id,
          diagnosis: data.description || '',
          confidence: data.confidence || '',
          recommendations: data.recommendations || [],
          condition_type: analysisType,
        });
      }
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-health">
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Scan className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">AI Image Diagnosis</h1>
            <p className="text-primary-foreground/80 text-sm">Upload medical images for AI-powered analysis</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl bg-warning/8 border border-warning/20 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <p className="text-xs text-muted-foreground">AI analysis is for educational purposes only. Always consult a healthcare professional for diagnosis.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-heading font-semibold">Upload Image</h3>

              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {analysisTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">{t.icon} {t.label} <span className="text-muted-foreground text-xs">— {t.desc}</span></span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border/50">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-contain bg-muted/20" />
                  <button onClick={() => { setImagePreview(null); setResult(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Click to upload or take photo</p>
                    <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </button>
              )}

              <div className="flex gap-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 gap-2">
                  <Camera className="h-4 w-4" /> Camera
                </Button>
                <Button onClick={analyzeImage} disabled={!imagePreview || loading}
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg">{result.condition_name || 'Analysis Result'}</h3>
                    <div className="flex gap-2">
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
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
              <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Scan className="h-8 w-8" />
              </div>
              <p className="font-heading font-semibold">Upload an image to start</p>
              <p className="text-sm mt-1">AI will analyze and provide insights</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageDiagnosis;
