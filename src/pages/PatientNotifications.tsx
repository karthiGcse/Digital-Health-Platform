import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Bell, Send, Search, CheckCircle2, Clock, Users, Stethoscope, Pill, BedDouble } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';

const templates = [
  { id: 'token', label: 'Token Ready', template: 'Your token #{n} is ready. Estimated wait: {time} mins' },
  { id: 'doctor', label: 'Doctor Ready', template: 'Dr. {name} is ready to see you — Room {n}' },
  { id: 'pharmacy', label: 'Medicine Ready', template: 'Your medicine is ready at Counter {n}' },
  { id: 'reminder', label: 'Med Reminder', template: 'Reminder: Take {med} {dose} — {time}' },
  { id: 'followup', label: 'Follow-up', template: 'Follow-up with Dr. {name} tomorrow at {time}' },
  { id: 'bed', label: 'Bed Assigned', template: 'Bed {n} ({ward}) has been assigned to you.' },
];

const typeIcons: Record<string, string> = { token: '🎫', doctor: '👨‍⚕️', pharmacy: '💊', reminder: '⏰', followup: '📅', bed: '🛏️' };

const PatientNotifications = () => {
  const { notifications, patients, addNotification } = useHospital();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const patientNames = patients.map(p => p.name);

  const handleSend = () => {
    if (!selectedPatient || (!selectedTemplate && !customMessage)) {
      toast({ title: 'Missing info', description: 'Select patient and message.', variant: 'destructive' });
      return;
    }
    const msg = customMessage || templates.find(t => t.id === selectedTemplate)?.template || '';
    addNotification({
      patient: selectedPatient,
      message: msg,
      type: (selectedTemplate as any) || 'reminder',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent',
    });
    setCustomMessage('');
    setSelectedTemplate('');
    toast({ title: 'Notification Sent ✓', description: `Sent to ${selectedPatient}` });
  };

  const filtered = notifications.filter(n =>
    n.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Patient Notifications</h1>
            <p className="text-sm text-muted-foreground">Send and track patient notifications — auto-linked from all modules</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/doctor-queue')}>
            <Stethoscope className="h-4 w-4 mr-1" /> Doctor Queue
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/smart-pharmacy')}>
            <Pill className="h-4 w-4 mr-1" /> Pharmacy
          </Button>
        </div>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">📋 All Notifications ({notifications.length})</TabsTrigger>
          <TabsTrigger value="send">📤 Send Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notifications..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notifications yet. They will appear automatically as patients are registered, prescriptions sent, beds assigned, etc.</p>
              ) : (
                filtered.map(n => (
                  <div key={n.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{typeIcons[n.type] || '📌'}</span>
                      <div>
                        <p className="text-sm font-semibold">{n.patient}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        n.status === 'Read' ? 'bg-emerald-500/15 text-emerald-600' :
                        n.status === 'Delivered' ? 'bg-blue-500/15 text-blue-600' :
                        'bg-muted text-muted-foreground'
                      }>{n.status}</Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Send Notification</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Patient</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger><SelectValue placeholder="Select patient..." /></SelectTrigger>
                    <SelectContent>
                      {patientNames.length > 0 ? (
                        patientNames.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)
                      ) : (
                        <SelectItem value="_none" disabled>No patients registered</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Template</label>
                  <Select value={selectedTemplate} onValueChange={v => { setSelectedTemplate(v); setCustomMessage(''); }}>
                    <SelectTrigger><SelectValue placeholder="Choose template..." /></SelectTrigger>
                    <SelectContent>
                      {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Custom Message</label>
                  <Textarea placeholder="Or type a custom message..." value={customMessage} onChange={e => { setCustomMessage(e.target.value); setSelectedTemplate(''); }} />
                </div>
                <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white" onClick={handleSend}>
                  <Send className="h-4 w-4 mr-2" /> Send Notification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Preview</CardTitle></CardHeader>
              <CardContent>
                {(selectedPatient && (selectedTemplate || customMessage)) ? (
                  <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
                    <p className="text-sm font-bold">{selectedPatient}</p>
                    <p className="text-sm">{customMessage || templates.find(t => t.id === selectedTemplate)?.template}</p>
                    <Badge className="bg-blue-500/15 text-blue-600">Preview</Badge>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">Select patient and message to preview</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientNotifications;
