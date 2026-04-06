import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Bell, Send, Search, CheckCircle2, Clock, MessageSquare, Users } from 'lucide-react';

interface Notification {
  id: string;
  patient: string;
  message: string;
  type: 'token' | 'doctor' | 'pharmacy' | 'reminder' | 'followup';
  time: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

const templates = [
  { id: 'token', label: 'Token Ready', template: 'Your token #{n} is ready. Estimated wait: {time} mins' },
  { id: 'doctor', label: 'Doctor Ready', template: 'Dr. {name} is ready to see you — Room {n}' },
  { id: 'pharmacy', label: 'Medicine Ready', template: 'Your medicine is ready at Counter {n}' },
  { id: 'reminder', label: 'Med Reminder', template: 'Reminder: Take {med} {dose} — {time}' },
  { id: 'followup', label: 'Follow-up', template: 'Follow-up with Dr. {name} tomorrow at {time}' },
];

const mockNotifications: Notification[] = [
  { id: '1', patient: 'Rahul Sharma', message: 'Your token #1 is ready. Estimated wait: 10 mins', type: 'token', time: '10:30 AM', status: 'Read' },
  { id: '2', patient: 'Priya Patel', message: 'Dr. Arun is ready to see you — Room 3', type: 'doctor', time: '10:45 AM', status: 'Delivered' },
  { id: '3', patient: 'Amit Kumar', message: 'Your medicine is ready at Counter 2', type: 'pharmacy', time: '11:00 AM', status: 'Sent' },
  { id: '4', patient: 'Sneha Gupta', message: 'Reminder: Take Azithromycin 500mg — 9:00 PM', type: 'reminder', time: '08:00 PM', status: 'Delivered' },
  { id: '5', patient: 'Vikram Singh', message: 'Follow-up with Dr. Meena tomorrow at 10:00 AM', type: 'followup', time: '06:00 PM', status: 'Sent' },
  { id: '6', patient: 'Meera Joshi', message: 'Your token #6 is ready. Estimated wait: 25 mins', type: 'token', time: '11:15 AM', status: 'Read' },
];

const patients = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Meera Joshi', 'Ravi Tiwari', 'Anjali Das'];

const typeIcons: Record<string, string> = { token: '🎫', doctor: '👨‍⚕️', pharmacy: '💊', reminder: '⏰', followup: '📅' };

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    if (!selectedPatient || (!selectedTemplate && !customMessage)) {
      toast({ title: 'Missing info', description: 'Select patient and message.', variant: 'destructive' });
      return;
    }
    const msg = customMessage || templates.find(t => t.id === selectedTemplate)?.template || '';
    const newNotif: Notification = {
      id: Date.now().toString(),
      patient: selectedPatient,
      message: msg,
      type: (selectedTemplate as Notification['type']) || 'reminder',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent',
    };
    setNotifications(prev => [newNotif, ...prev]);
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
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Patient Notifications</h1>
          <p className="text-sm text-muted-foreground">Send and track patient notifications</p>
        </div>
      </div>

      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">📤 Send</TabsTrigger>
          <TabsTrigger value="history">📋 History ({notifications.length})</TabsTrigger>
        </TabsList>

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
                      {patients.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Templates</p>
                  <div className="space-y-2">
                    {templates.map(t => (
                      <div key={t.id} className="p-2 rounded-lg bg-muted/30 text-xs">
                        <span className="font-medium">{t.label}:</span> {t.template}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notifications..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              {filtered.map(n => (
                <div key={n.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeIcons[n.type]}</span>
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
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientNotifications;
