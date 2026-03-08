import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Sparkles, Loader2, Download, Clock, FileBarChart, FileDown, FileType } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import jsPDF from 'jspdf';

interface Report {
  id: string;
  content: string;
  generatedAt: string;
  type: string;
}

const REPORT_TYPES = [
  { value: 'comprehensive', label: 'Comprehensive Health Report', description: 'Full analysis of symptoms, medications & prescriptions' },
  { value: 'symptoms', label: 'Symptom Summary', description: 'Focused analysis of recent symptom patterns' },
  { value: 'medication', label: 'Medication Adherence', description: 'Medication schedule compliance & recommendations' },
  { value: 'prescription', label: 'Prescription Overview', description: 'Summary of active prescriptions & interactions' },
];

const AIReports = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('comprehensive');
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown' | 'text'>('pdf');

  const generateReport = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const [sRes, rRes, pRes] = await Promise.all([
        supabase.from('symptom_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('reminders').select('*').eq('user_id', user.id),
        supabase.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      ]);
      const { data, error } = await supabase.functions.invoke('ai-health-report', {
        body: {
          symptomLogs: sRes.data || [],
          reminders: rRes.data || [],
          prescriptions: pRes.data || [],
          profileName: profile?.name,
          reportType: selectedType,
        },
      });
      if (error) throw error;
      const typeLabel = REPORT_TYPES.find(t => t.value === selectedType)?.label || 'Health Report';
      const report: Report = { id: crypto.randomUUID(), content: data.report, generatedAt: new Date().toLocaleString(), type: typeLabel };
      setReports(prev => [report, ...prev]);
      setCurrentReport(report.id);
      toast({ title: 'Report generated successfully' });
    } catch (e: any) { toast({ title: 'Generation failed', description: e.message, variant: 'destructive' }); }
    setGenerating(false);
  };

  const downloadAsMarkdown = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${report.type.replace(/\s+/g, '-')}-${report.generatedAt.replace(/[/,: ]/g, '-')}.md`;
    a.click(); URL.revokeObjectURL(url);
  };

  const downloadAsText = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${report.type.replace(/\s+/g, '-')}-${report.generatedAt.replace(/[/,: ]/g, '-')}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const downloadAsPDF = (report: Report) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255);
    doc.text('S47 Health — ' + report.type, margin, y);
    y += 10;

    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(`Generated: ${report.generatedAt}`, margin, y);
    y += 8;

    doc.setDrawColor(200);
    doc.line(margin, y, 190, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(40);

    const lines = report.content.split('\n');
    for (const line of lines) {
      if (y > 270) { doc.addPage(); y = margin; }

      if (line.startsWith('# ')) {
        doc.setFontSize(16); doc.setTextColor(41, 98, 255);
        doc.text(line.replace(/^#+\s*/, ''), margin, y);
        y += 9; doc.setFontSize(11); doc.setTextColor(40);
      } else if (line.startsWith('## ')) {
        doc.setFontSize(13); doc.setTextColor(30);
        doc.text(line.replace(/^#+\s*/, ''), margin, y);
        y += 8; doc.setFontSize(11); doc.setTextColor(40);
      } else if (line.startsWith('### ')) {
        doc.setFontSize(12); doc.setTextColor(50);
        doc.text(line.replace(/^#+\s*/, ''), margin, y);
        y += 7; doc.setFontSize(11); doc.setTextColor(40);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const wrapped = doc.splitTextToSize(`• ${line.replace(/^[-*]\s*/, '')}`, 165);
        doc.text(wrapped, margin + 4, y);
        y += wrapped.length * 5 + 2;
      } else if (line.trim() === '') {
        y += 4;
      } else {
        const cleaned = line.replace(/\*\*/g, '').replace(/\*/g, '');
        const wrapped = doc.splitTextToSize(cleaned, 170);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 2;
      }
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Disclaimer: This report is AI-generated for educational purposes only. Consult a healthcare professional.', margin, 285);

    doc.save(`${report.type.replace(/\s+/g, '-')}-${Date.now()}.pdf`);
    toast({ title: 'PDF downloaded successfully' });
  };

  const handleDownload = () => {
    if (!active) return;
    if (downloadFormat === 'pdf') downloadAsPDF(active);
    else if (downloadFormat === 'markdown') downloadAsMarkdown(active);
    else downloadAsText(active);
    setDownloadDialogOpen(false);
  };

  const active = reports.find(r => r.id === currentReport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header gradient-health">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileBarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">AI Health Reports</h1>
              <p className="text-sm text-white/70">AI-generated comprehensive health analysis</p>
            </div>
          </div>
          <Button onClick={generateReport} disabled={generating} className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm">
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Report
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      </div>

      {/* Report Type Selector */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileType className="h-4 w-4 text-primary" /> Select Report Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedType} onValueChange={setSelectedType} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {REPORT_TYPES.map((type) => (
              <Label
                key={type.value}
                htmlFor={type.value}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedType === type.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={type.value} id={type.value} className="mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="pb-2"><CardTitle className="text-base">Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {reports.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-14 w-14 rounded-2xl gradient-health flex items-center justify-center mx-auto shadow-glow">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">No reports yet. Select a type and click "Generate Report".</p>
              </div>
            ) : (
              reports.map((r) => (
                <button key={r.id} onClick={() => setCurrentReport(r.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm ${currentReport === r.id ? 'gradient-health text-white shadow-glow' : 'hover:bg-muted'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.type}</p>
                      <p className={`text-xs flex items-center gap-1 ${currentReport === r.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                        <Clock className="h-3 w-3" /> {r.generatedAt}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-hover">
          <CardContent className="p-6">
            {active ? (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs rounded-full"><Clock className="h-3 w-3 mr-1" /> {active.generatedAt}</Badge>
                    <Badge className="text-xs rounded-full bg-primary/10 text-primary border-primary/20">{active.type}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setDownloadDialogOpen(true)} className="rounded-xl gap-1.5">
                    <FileDown className="h-4 w-4" /> Download Report
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{active.content}</ReactMarkdown></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-20 w-20 rounded-3xl gradient-health flex items-center justify-center shadow-glow">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Generate Your Health Report</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">Select a report type above, then generate an AI-powered analysis.</p>
                </div>
                <Button onClick={generateReport} disabled={generating} className="gradient-health text-white border-0 shadow-glow hover:opacity-90 rounded-xl">
                  {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Download Format Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" /> Download Report
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred download format:</p>
            <RadioGroup value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'pdf' | 'markdown' | 'text')} className="space-y-3">
              <Label htmlFor="fmt-pdf" className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadFormat === 'pdf' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                <RadioGroupItem value="pdf" id="fmt-pdf" />
                <div>
                  <p className="text-sm font-semibold">PDF Document</p>
                  <p className="text-xs text-muted-foreground">Formatted report ready to print or share with doctors</p>
                </div>
              </Label>
              <Label htmlFor="fmt-md" className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadFormat === 'markdown' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                <RadioGroupItem value="markdown" id="fmt-md" />
                <div>
                  <p className="text-sm font-semibold">Markdown (.md)</p>
                  <p className="text-xs text-muted-foreground">Rich text format for editing and documentation</p>
                </div>
              </Label>
              <Label htmlFor="fmt-txt" className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${downloadFormat === 'text' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                <RadioGroupItem value="text" id="fmt-txt" />
                <div>
                  <p className="text-sm font-semibold">Plain Text (.txt)</p>
                  <p className="text-xs text-muted-foreground">Simple text file compatible with any device</p>
                </div>
              </Label>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDownload} className="gap-1.5">
              <Download className="h-4 w-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIReports;
