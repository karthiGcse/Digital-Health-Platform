import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Sparkles, Loader2, Download, Clock, FileBarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  content: string;
  generatedAt: string;
}

const AIReports = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

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
        body: { symptomLogs: sRes.data || [], reminders: rRes.data || [], prescriptions: pRes.data || [], profileName: profile?.name },
      });
      if (error) throw error;
      const report: Report = { id: crypto.randomUUID(), content: data.report, generatedAt: new Date().toLocaleString() };
      setReports(prev => [report, ...prev]);
      setCurrentReport(report.id);
      toast({ title: 'Report generated successfully' });
    } catch (e: any) { toast({ title: 'Generation failed', description: e.message, variant: 'destructive' }); }
    setGenerating(false);
  };

  const downloadReport = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `health-report-${report.generatedAt.replace(/[/,: ]/g, '-')}.md`;
    a.click(); URL.revokeObjectURL(url);
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

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="pb-2"><CardTitle className="text-base">Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {reports.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-14 w-14 rounded-2xl gradient-health flex items-center justify-center mx-auto shadow-glow">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">No reports yet. Click "Generate Report" to create one.</p>
              </div>
            ) : (
              reports.map((r) => (
                <button key={r.id} onClick={() => setCurrentReport(r.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm ${currentReport === r.id ? 'gradient-health text-white shadow-glow' : 'hover:bg-muted'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">Health Report</p>
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
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs rounded-full"><Clock className="h-3 w-3 mr-1" /> {active.generatedAt}</Badge>
                  <Button variant="outline" size="sm" onClick={() => downloadReport(active)} className="rounded-xl">
                    <Download className="h-4 w-4 mr-1" /> Download
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
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">Our AI analyzes your symptom logs, medication adherence, and prescriptions.</p>
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
    </div>
  );
};

export default AIReports;
