import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, Upload, FileImage, Brain, AlertTriangle, Clock, Eye, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const scanTypes = [
  { value: 'ct', label: 'CT Scan', icon: '🫁' },
  { value: 'mri', label: 'MRI', icon: '🧠' },
  { value: 'xray', label: 'X-Ray', icon: '🦴' },
  { value: 'ultrasound', label: 'Ultrasound', icon: '📡' },
];

const recentScans = [
  { id: 1, type: 'CT Scan', bodyPart: 'Chest', date: '2026-03-05', status: 'Analyzed', finding: 'Normal', confidence: 96 },
  { id: 2, type: 'MRI', bodyPart: 'Brain', date: '2026-03-02', status: 'Analyzed', finding: 'Minor anomaly detected', confidence: 88 },
  { id: 3, type: 'X-Ray', bodyPart: 'Spine', date: '2026-02-28', status: 'Pending Review', finding: 'Awaiting analysis', confidence: 0 },
  { id: 4, type: 'Ultrasound', bodyPart: 'Abdomen', date: '2026-02-20', status: 'Analyzed', finding: 'Normal', confidence: 94 },
];

const Radiology = () => {
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState('ct');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeScan = useCallback(async () => {
    if (!imagePreview) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-diagnosis', {
        body: { image_base64: imagePreview, analysis_type: `radiology_${scanType}` },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success('Scan analysis complete');
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [imagePreview, scanType]);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">AI Radiology</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AI Radiology Assistant</h1>
          <p className="mt-1 text-white/75 text-sm">Advanced AI analysis of CT scans, MRIs, and ultrasounds.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Scans Analyzed', value: '47', icon: FileImage, iconClass: 'stat-icon-blue' },
          { label: 'Anomalies Found', value: '3', icon: AlertTriangle, iconClass: 'stat-icon-orange' },
          { label: 'Avg Confidence', value: '94%', icon: Brain, iconClass: 'stat-icon-green' },
          { label: 'Pending Review', value: '1', icon: Clock, iconClass: 'stat-icon-purple' },
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

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Scan</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="3d">3D Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-heading font-semibold">Upload Medical Scan</h3>

                <Select value={scanType} onValueChange={setScanType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {scanTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <input ref={fileInputRef} type="file" accept="image/*,.dcm" className="hidden" onChange={handleFileSelect} />

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border/50">
                    <img src={imagePreview} alt="Scan preview" className="w-full max-h-80 object-contain bg-muted/20" />
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
                      <p className="font-medium text-sm">Click to upload scan image</p>
                      <p className="text-xs mt-1">JPEG, PNG, DICOM up to 10MB</p>
                    </div>
                  </button>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1 gap-2">
                    <Upload className="h-4 w-4" /> Browse Files
                  </Button>
                  <Button onClick={analyzeScan} disabled={!imagePreview || loading}
                    className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                    {loading ? 'Analyzing...' : 'Analyze Scan'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Analysis Result</h3>
                {loading && (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">AI is analyzing your scan...</p>
                  </div>
                )}
                {!loading && !result && (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Brain className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Upload and analyze a scan to see results</p>
                  </div>
                )}
                {!loading && result && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{result.condition_name || 'Analysis Complete'}</h4>
                      {result.urgency && (
                        <Badge variant={result.urgency === 'emergency' ? 'destructive' : result.urgency === 'high' ? 'destructive' : 'secondary'}>
                          {result.urgency} urgency
                        </Badge>
                      )}
                    </div>
                    {result.confidence && (
                      <p className="text-xs text-muted-foreground">Confidence: <span className="font-semibold text-foreground">{result.confidence}</span></p>
                    )}
                    {result.description && <p className="text-sm text-muted-foreground">{result.description}</p>}
                    {result.possible_conditions?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Possible Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.possible_conditions.map((c: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.recommendations?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Recommendations:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.recommendations.map((r: string, i: number) => (
                            <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.when_to_see_doctor && (
                      <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
                        <p className="text-xs font-medium text-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> When to See a Doctor</p>
                        <p className="text-xs text-muted-foreground mt-1">{result.when_to_see_doctor}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {recentScans.map(scan => (
                  <div key={scan.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="stat-icon-blue h-10 w-10"><FileImage className="h-5 w-5" /></div>
                      <div>
                        <p className="font-medium text-sm">{scan.type} — {scan.bodyPart}</p>
                        <p className="text-xs text-muted-foreground">{scan.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={scan.status === 'Analyzed' ? 'default' : 'secondary'}>{scan.status}</Badge>
                      {scan.confidence > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="text-sm font-semibold">{scan.confidence}%</p>
                        </div>
                      )}
                      <Button size="sm" variant="outline"><Eye className="h-3 w-3 mr-1" /> View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="3d">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="h-64 rounded-xl bg-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">3D visualization will render here</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Upload a scan to generate 3D model</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Radiology;
