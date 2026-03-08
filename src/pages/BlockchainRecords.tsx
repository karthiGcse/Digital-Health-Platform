import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Link2, CheckCircle2, Clock, FileText, Eye, Share2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const records = [
  { id: 'BLK-001', type: 'Lab Report', title: 'Complete Blood Count', date: '2026-03-05', hash: '0x7a3f...e92d', verified: true, shared: ['Dr. Sharma'], hospital: 'City Hospital' },
  { id: 'BLK-002', type: 'Prescription', title: 'Hypertension Medication', date: '2026-03-01', hash: '0x4b2c...f18a', verified: true, shared: [], hospital: 'Apollo Clinic' },
  { id: 'BLK-003', type: 'Imaging', title: 'Chest X-Ray Report', date: '2026-02-20', hash: '0x9d1e...c74b', verified: true, shared: ['Dr. Patel', 'Dr. Khan'], hospital: 'Max Healthcare' },
  { id: 'BLK-004', type: 'Vaccination', title: 'COVID-19 Booster', date: '2026-02-15', hash: '0x2f8a...d63c', verified: true, shared: [], hospital: 'Government PHC' },
  { id: 'BLK-005', type: 'Discharge Summary', title: 'Appendectomy Recovery', date: '2026-01-10', hash: '0x6c4d...a91f', verified: true, shared: ['Insurance Co.'], hospital: 'Fortis Hospital' },
];

const typeIcons: Record<string, string> = {
  'Lab Report': '🧪', 'Prescription': '💊', 'Imaging': '🩻', 'Vaccination': '💉', 'Discharge Summary': '🏥',
};

const BlockchainRecords = () => {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const filtered = records.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-red-600 to-rose-700 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Blockchain Health Records</h1>
          </div>
          <p className="text-white/80 text-sm">Secure, tamper-proof medical records with patient-controlled access.</p>
        </div>
        <Lock className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: records.length, icon: FileText },
          { label: 'Verified', value: records.filter(r => r.verified).length, icon: CheckCircle2 },
          { label: 'Shared Access', value: records.reduce((s, r) => s + r.shared.length, 0), icon: Share2 },
          { label: 'Hospitals', value: new Set(records.map(r => r.hospital)).size, icon: Link2 },
        ].map((s, i) => (
          <Card key={s.label} className="rounded-card">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`rounded-card transition-all cursor-pointer ${selectedRecord === r.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedRecord(selectedRecord === r.id ? null : r.id)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeIcons[r.type] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{r.title}</h4>
                      {r.verified && <Badge className="bg-success/10 text-success border-0 text-[10px] gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</Badge>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{r.type}</span>
                      <span>{r.hospital}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={e => { e.stopPropagation(); toast.info('Viewing record...'); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={e => { e.stopPropagation(); toast.success('Share link copied!'); }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedRecord === r.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Lock className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Block Hash:</span>
                      <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{r.hash}</code>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Share2 className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">Shared with:</span>
                      <span>{r.shared.length > 0 ? r.shared.join(', ') : 'No one'}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.success('Access granted')}>
                        <Share2 className="h-3 w-3" /> Grant Access
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.info('Downloading...')}>
                        <FileText className="h-3 w-3" /> Download
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainRecords;
