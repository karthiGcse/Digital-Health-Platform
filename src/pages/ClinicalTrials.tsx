import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Microscope, MapPin, CheckCircle2, Clock, ExternalLink, Filter } from 'lucide-react';

const trials = [
  { title: 'Phase III Diabetes Management Trial', sponsor: 'HealthCorp Pharma', location: 'Mumbai, India', distance: '5 km', phase: 'Phase III', status: 'Recruiting', match: 95, condition: 'Type 2 Diabetes' },
  { title: 'Cardiovascular Risk Reduction Study', sponsor: 'CardioResearch Ltd', location: 'Chennai, India', distance: '12 km', phase: 'Phase II', status: 'Recruiting', match: 82, condition: 'Hypertension' },
  { title: 'Novel Antibiotic Efficacy Trial', sponsor: 'BioMed Sciences', location: 'Bangalore, India', distance: '280 km', phase: 'Phase I', status: 'Enrolling', match: 68, condition: 'Bacterial Infection' },
  { title: 'Mental Health CBT Digital Therapy', sponsor: 'MindWell Inc', location: 'Remote / Online', distance: 'Remote', phase: 'Phase II', status: 'Recruiting', match: 91, condition: 'Anxiety & Depression' },
];

const ClinicalTrials = () => (
  <div className="space-y-6">
    <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Microscope className="h-5 w-5 text-white/80" />
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Clinical Trials</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Clinical Trial Matcher</h1>
        <p className="mt-1 text-white/75 text-sm">Find relevant clinical trials worldwide based on your health profile.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><Microscope className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">{trials.length}</p><p className="text-xs text-muted-foreground">Matching Trials</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">95%</p><p className="text-xs text-muted-foreground">Best Match</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Clock className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">3</p><p className="text-xs text-muted-foreground">Recruiting Now</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Matched Clinical Trials</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trials.map((t, i) => (
            <div key={i} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{t.title}</h4>
                  <p className="text-xs text-muted-foreground">{t.sponsor}</p>
                </div>
                <Badge className={t.match >= 90 ? 'bg-success/10 text-success' : t.match >= 80 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>{t.match}% Match</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{t.phase}</Badge>
                <Badge variant="outline">{t.condition}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{t.location} ({t.distance})</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={t.status === 'Recruiting' ? 'default' : 'secondary'}>{t.status}</Badge>
                <Button size="sm" variant="outline"><ExternalLink className="h-3 w-3 mr-1" /> View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ClinicalTrials;
