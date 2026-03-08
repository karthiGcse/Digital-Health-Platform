import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Loader2, Eye, X } from 'lucide-react';

export const analysisTypes = [
  { value: 'skin', label: 'Skin Condition', icon: '🩹', desc: 'Rashes, moles, lesions, acne' },
  { value: 'eye', label: 'Eye Health', icon: '👁️', desc: 'Redness, swelling, discharge' },
  { value: 'wound', label: 'Wound Assessment', icon: '🩸', desc: 'Cuts, burns, infections' },
  { value: 'dental', label: 'Dental / Oral', icon: '🦷', desc: 'Gums, teeth, mouth sores' },
  { value: 'nail', label: 'Nail Health', icon: '💅', desc: 'Discoloration, fungal signs' },
  { value: 'hair', label: 'Hair & Scalp', icon: '💇', desc: 'Hair loss, dandruff, scalp issues' },
  { value: 'tongue', label: 'Tongue Diagnosis', icon: '👅', desc: 'Coating, color, texture' },
  { value: 'bruise', label: 'Bruise / Swelling', icon: '🟣', desc: 'Bruises, lumps, inflammation' },
  { value: 'general', label: 'General', icon: '🔍', desc: 'Any visible health concern' },
];

interface Props {
  onAnalyze: (image: string, type: string) => void;
  loading: boolean;
}

const AnalysisUpload = ({ onAnalyze, loading }: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
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
            <button onClick={() => setImagePreview(null)}
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
          <Button onClick={() => imagePreview && onAnalyze(imagePreview, analysisType)} disabled={!imagePreview || loading}
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisUpload;
