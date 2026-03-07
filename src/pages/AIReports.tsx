import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Sparkles, Loader2, Download, Clock, RefreshCw } from 'lucide-react';
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
        body: {
          symptomLogs: sRes.data || [],
          reminders: rRes.data || [],
          prescriptions: pRes.data || [],
          profileName: profile?.name,
        },
      });

      if (error) throw error;
      const report: Report = {
        id: crypto.randomUUID(),
        content: data.report,
        generatedAt: new Date().toLocaleString(),
      };
      setReports(prev => [report, ...prev]);
      setCurrentReport(report.id);
      toast({ title: 'Report generated successfully' });
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' });
    }
    setGenerating(false);
  };

  const downloadReport = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${report.generatedAt.replace(/[/,: ]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = reports.find(r => r.id === currentReport);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">AI Health Reports</h1>
          <p className="text-sm text-muted-foreground">AI-generated comprehensive health analysis</p>
        </div>
        <Button onClick={generateReport} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Report list */}
        <Card className="rounded-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reports.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">No reports yet. Click "Generate Report" to create one from your health data.</p>
              </div>
            ) : (
              reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setCurrentReport(r.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                    currentReport === r.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">Health Report</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {r.generatedAt}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Report viewer */}
        <Card className="lg:col-span-3 rounded-card shadow-sm">
          <CardContent className="p-6">
            {active ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" /> {active.generatedAt}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => downloadReport(active)}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{active.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Generate Your Health Report</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Our AI analyzes your symptom logs, medication adherence, and prescriptions to create a comprehensive health summary.
                  </p>
                </div>
                <Button onClick={generateReport} disabled={generating}>
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
