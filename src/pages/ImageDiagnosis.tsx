import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Scan, History, ArrowLeftRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

import AnalysisUpload from '@/components/image-diagnosis/AnalysisUpload';
import DiagnosisResultView, { type DiagnosisResultData } from '@/components/image-diagnosis/DiagnosisResult';
import DiagnosisHistory from '@/components/image-diagnosis/DiagnosisHistory';
import ComparisonView from '@/components/image-diagnosis/ComparisonView';

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

const ImageDiagnosis = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResultData | null>(null);
  const [lastImageUrl, setLastImageUrl] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [compareSlots, setCompareSlots] = useState<(HistoryItem | null)[]>([null, null]);
  const [activeTab, setActiveTab] = useState('analyze');

  const analyzeImage = useCallback(async (imageBase64: string, analysisType: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-diagnosis', {
        body: { image_base64: imageBase64, analysis_type: analysisType },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);

      // Upload image to storage
      let imageUrl = '';
      if (user) {
        try {
          const fileName = `${user.id}/${Date.now()}.jpg`;
          const base64Data = imageBase64.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);

          const { error: uploadError } = await supabase.storage
            .from('diagnosis-images')
            .upload(fileName, byteArray, { contentType: 'image/jpeg' });

          if (!uploadError) {
            // Bucket is private; store the storage path and generate signed URLs on demand
            const { data: signed } = await supabase.storage
              .from('diagnosis-images')
              .createSignedUrl(fileName, 60 * 60 * 24 * 7);
            imageUrl = signed?.signedUrl || fileName;
          }
        } catch { /* image storage optional */ }

        setLastImageUrl(imageUrl);

        await supabase.from('image_diagnoses').insert({
          user_id: user.id,
          diagnosis: data.description || '',
          confidence: data.confidence || '',
          recommendations: data.recommendations || [],
          condition_type: analysisType,
          image_url: imageUrl,
          condition_name: data.condition_name || '',
          urgency: data.urgency || '',
          when_to_see_doctor: data.when_to_see_doctor || '',
          possible_conditions: data.possible_conditions || [],
        });

        setHistoryRefresh(prev => prev + 1);
      }
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const exportPDF = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255);
    doc.text('S47 Health — Diagnosis Report', margin, y);
    y += 12;

    doc.setDrawColor(200);
    doc.line(margin, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(result.condition_name || 'Analysis Result', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
    if (result.confidence) doc.text(`Confidence: ${result.confidence}`, 100, y);
    if (result.urgency) doc.text(`Urgency: ${result.urgency}`, 150, y);
    y += 10;

    if (result.description) {
      doc.setFontSize(11);
      doc.setTextColor(50);
      const lines = doc.splitTextToSize(result.description, 170);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 6;
    }

    if (result.possible_conditions?.length) {
      doc.setFontSize(12);
      doc.setTextColor(30);
      doc.text('Possible Conditions:', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(70);
      result.possible_conditions.forEach(c => { doc.text(`• ${c}`, margin + 4, y); y += 5; });
      y += 4;
    }

    if (result.recommendations?.length) {
      doc.setFontSize(12);
      doc.setTextColor(30);
      doc.text('Recommendations:', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(70);
      result.recommendations.forEach(r => {
        const rLines = doc.splitTextToSize(`✓ ${r}`, 165);
        doc.text(rLines, margin + 4, y);
        y += rLines.length * 5 + 2;
      });
      y += 4;
    }

    if (result.when_to_see_doctor) {
      doc.setFontSize(12);
      doc.setTextColor(200, 100, 0);
      doc.text('⚠ When to See a Doctor:', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(70);
      const dLines = doc.splitTextToSize(result.when_to_see_doctor, 170);
      doc.text(dLines, margin, y);
      y += dLines.length * 5 + 8;
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Disclaimer: This report is AI-generated for educational purposes only. Consult a healthcare professional.', margin, 280);

    doc.save(`S47-Diagnosis-${Date.now()}.pdf`);
    toast.success('PDF report downloaded');
  }, [result]);

  const handleSelectForCompare = useCallback((item: HistoryItem) => {
    setCompareSlots(prev => {
      if (prev.some(s => s?.id === item.id)) return prev.map(s => s?.id === item.id ? null : s);
      if (!prev[0]) return [item, prev[1]];
      if (!prev[1]) return [prev[0], item];
      return [prev[1], item];
    });
  }, []);

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyze" className="gap-1.5"><Eye className="h-3.5 w-3.5" /> Analyze</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History</TabsTrigger>
          <TabsTrigger value="compare" className="gap-1.5"><ArrowLeftRight className="h-3.5 w-3.5" /> Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <AnalysisUpload onAnalyze={analyzeImage} loading={loading} />
            <DiagnosisResultView result={result} onExportPDF={result ? exportPDF : undefined} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <DiagnosisHistory onSelectForCompare={handleSelectForCompare} compareSlots={compareSlots} refreshKey={historyRefresh} />
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <ComparisonView slots={compareSlots} onRemoveSlot={(i) => setCompareSlots(prev => prev.map((s, idx) => idx === i ? null : s))} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageDiagnosis;
