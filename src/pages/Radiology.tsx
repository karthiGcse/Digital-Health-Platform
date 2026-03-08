import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Stethoscope, Upload, FileImage, Brain, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';

const recentScans = [
  { id: 1, type: 'CT Scan', bodyPart: 'Chest', date: '2026-03-05', status: 'Analyzed', finding: 'Normal', confidence: 96 },
  { id: 2, type: 'MRI', bodyPart: 'Brain', date: '2026-03-02', status: 'Analyzed', finding: 'Minor anomaly detected', confidence: 88 },
  { id: 3, type: 'X-Ray', bodyPart: 'Spine', date: '2026-02-28', status: 'Pending Review', finding: 'Awaiting analysis', confidence: 0 },
  { id: 4, type: 'Ultrasound', bodyPart: 'Abdomen', date: '2026-02-20', status: 'Analyzed', finding: 'Normal', confidence: 94 },
];

const Radiology = () => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">AI Radiology</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">AI Radiology Assistant</h1>
          <p className="mt-1 text-white/75 text-sm">Advanced AI analysis of CT scans, MRIs, and ultrasounds with 3D visualization.</p>
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
          <Card>
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center">
                <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Upload Medical Scan</h3>
                <p className="text-sm text-muted-foreground mb-4">Supports DICOM, JPEG, PNG formats. CT, MRI, X-Ray, Ultrasound.</p>
                <Button className="gradient-cool text-white" onClick={() => setUploading(true)}>
                  <Upload className="h-4 w-4 mr-2" /> Select File
                </Button>
                {uploading && <p className="text-sm text-primary mt-4 animate-pulse">Analyzing scan with AI...</p>}
              </div>
            </CardContent>
          </Card>
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
