import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UsersRound, MessageSquare, Heart, Shield, Users } from 'lucide-react';

const groups = [
  { name: 'Diabetes Support Circle', members: 1240, active: 85, category: 'Chronic Condition', joined: true },
  { name: 'Anxiety & Depression Help', members: 890, active: 120, category: 'Mental Health', joined: true },
  { name: 'Post-Surgery Recovery', members: 456, active: 32, category: 'Recovery', joined: false },
  { name: 'Heart Health Warriors', members: 678, active: 48, category: 'Cardiac', joined: false },
  { name: 'New Parents Support', members: 2100, active: 200, category: 'Parenting', joined: false },
];

const PeerSupport = () => {
  const [joinedGroups, setJoinedGroups] = useState(new Set([0, 1]));

  return (
    <div className="space-y-6">
      <div className="page-header gradient-success animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1"><UsersRound className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Peer Support</span></div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Peer Health Support Groups</h1>
          <p className="mt-1 text-white/75 text-sm">Connect with others managing similar health conditions.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Users className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Groups Joined</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><MessageSquare className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">24</p><p className="text-xs text-muted-foreground">Messages This Week</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><Shield className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">100%</p><p className="text-xs text-muted-foreground">Anonymous</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Health Support Groups</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groups.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={joinedGroups.has(i) ? 'stat-icon-green' : 'stat-icon-blue'}><UsersRound className="h-4 w-4" /></div>
                  <div>
                    <p className="font-medium text-sm">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.members.toLocaleString()} members • {g.active} active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{g.category}</Badge>
                  <Button size="sm" variant={joinedGroups.has(i) ? 'default' : 'outline'} onClick={() => setJoinedGroups(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                    {joinedGroups.has(i) ? 'Open' : 'Join'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerSupport;
