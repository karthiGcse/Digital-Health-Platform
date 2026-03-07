import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Phone, AlertCircle, Heart, Flame, Droplets, Zap, Bug,
  Bone, Brain, Baby, Search, ChevronRight, Shield
} from 'lucide-react';

const EMERGENCY_NUMBERS = [
  { name: 'Emergency (Ambulance)', number: '112', icon: Phone, gradient: 'gradient-danger' },
  { name: 'Police', number: '100', icon: Shield, gradient: 'gradient-cool' },
  { name: 'Fire', number: '101', icon: Flame, gradient: 'gradient-warm' },
  { name: 'Poison Control', number: '1800-11-6117', icon: AlertCircle, gradient: 'gradient-health' },
];

const FIRST_AID_GUIDES = [
  { title: 'Heart Attack', icon: Heart, gradient: 'gradient-danger', symptoms: ['Chest pain/pressure', 'Shortness of breath', 'Cold sweat', 'Nausea'], steps: ['Call 112 immediately', 'Have the person sit or lie down comfortably', 'Give aspirin (325mg) if not allergic and conscious', 'Loosen tight clothing', 'If unconscious and not breathing, begin CPR', 'Use AED if available'] },
  { title: 'Choking', icon: Droplets, gradient: 'gradient-cool', symptoms: ['Cannot speak/cough/breathe', 'Clutching throat', 'Turning blue'], steps: ['Ask "Are you choking?" – if they can\'t respond, act immediately', 'Stand behind the person, wrap arms around waist', 'Make a fist above the navel, below ribcage', 'Give 5 quick upward abdominal thrusts (Heimlich maneuver)', 'Repeat until object is expelled', 'If unconscious, call 112 and begin CPR'] },
  { title: 'Burns', icon: Flame, gradient: 'gradient-warm', symptoms: ['Red/blistered skin', 'Pain', 'Swelling', 'White/charred skin (severe)'], steps: ['Remove from heat source immediately', 'Cool burn under running water for 10-20 minutes', 'Do NOT apply ice, butter, or toothpaste', 'Cover loosely with sterile bandage', 'Take over-the-counter pain relief if needed', 'Seek medical help for burns larger than your palm or on face/joints'] },
  { title: 'Electric Shock', icon: Zap, gradient: 'gradient-warm', symptoms: ['Burns at contact point', 'Muscle spasms', 'Difficulty breathing', 'Loss of consciousness'], steps: ['Do NOT touch the person if still in contact with electrical source', 'Turn off power source or use non-conducting object to separate', 'Call 112 immediately', 'Check breathing and pulse – begin CPR if needed', 'Treat visible burns with cool water', 'Keep person lying down and warm (treat for shock)'] },
  { title: 'Snake/Insect Bite', icon: Bug, gradient: 'gradient-success', symptoms: ['Puncture marks', 'Swelling/redness', 'Pain', 'Nausea/dizziness'], steps: ['Keep the person calm and still', 'Call 112 or go to nearest hospital', 'Remove jewelry/tight clothing near bite', 'Keep bitten area below heart level', 'Do NOT cut the wound or try to suck out venom', 'Note the time of bite and appearance of snake/insect if possible'] },
  { title: 'Fractures', icon: Bone, gradient: 'gradient-cool', symptoms: ['Severe pain', 'Swelling', 'Deformity', 'Inability to move limb'], steps: ['Do NOT try to realign the bone', 'Immobilize the injured area – use a splint if available', 'Apply ice pack wrapped in cloth to reduce swelling', 'Elevate the injured limb if possible', 'Give pain medication if conscious', 'Seek immediate medical attention'] },
  { title: 'Seizure', icon: Brain, gradient: 'gradient-health', symptoms: ['Uncontrolled shaking', 'Loss of consciousness', 'Stiffening', 'Confusion after'], steps: ['Clear the area of dangerous objects', 'Do NOT hold the person down or put anything in their mouth', 'Place them on their side (recovery position)', 'Cushion the head with something soft', 'Time the seizure – call 112 if it lasts > 5 minutes', 'Stay with them until fully conscious and oriented'] },
  { title: 'Infant Choking', icon: Baby, gradient: 'gradient-warm', symptoms: ['Difficulty breathing', 'Weak/no cry', 'Turning blue', 'Cannot cough'], steps: ['Place infant face-down on your forearm, supporting the head', 'Give 5 firm back blows between shoulder blades', 'Turn infant face-up and give 5 chest thrusts (2 fingers on breastbone)', 'Repeat back blows and chest thrusts until object is expelled', 'If infant becomes unconscious, call 112 and begin infant CPR', 'Do NOT use abdominal thrusts on infants under 1 year'] },
];

const Emergency = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof FIRST_AID_GUIDES[0] | null>(null);

  const filtered = FIRST_AID_GUIDES.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="page-header gradient-danger animate-gradient">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">Emergency Services</h1>
              <p className="text-white/70 text-sm">Quick access to emergency contacts and first-aid guides</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Emergency Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {EMERGENCY_NUMBERS.map((num) => (
          <a key={num.number} href={`tel:${num.number}`}>
            <Card className="card-hover cursor-pointer group">
              <CardContent className="p-4 text-center space-y-2">
                <div className={`h-14 w-14 rounded-2xl ${num.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                  <num.icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm font-medium">{num.name}</p>
                <p className="text-xl font-heading font-bold">{num.number}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* First Aid Guides */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold">First-Aid Guides</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="card-hover lg:col-span-1">
            <ScrollArea className="h-[500px]">
              <CardContent className="p-2 space-y-1">
                {filtered.map((guide) => (
                  <button key={guide.title} onClick={() => setSelected(guide)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${selected?.title === guide.title ? 'gradient-health text-white shadow-glow' : 'hover:bg-muted'}`}>
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${selected?.title === guide.title ? 'bg-white/20' : guide.gradient}`}>
                      <guide.icon className={`h-4 w-4 ${selected?.title === guide.title ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span className="text-sm font-medium flex-1">{guide.title}</span>
                    <ChevronRight className={`h-4 w-4 ${selected?.title === guide.title ? 'text-white/70' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>

          <Card className="card-hover lg:col-span-2">
            <CardContent className="p-6">
              {selected ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-2xl ${selected.gradient} flex items-center justify-center shadow-lg`}>
                      <selected.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold">{selected.title}</h3>
                      <p className="text-xs text-muted-foreground">First-Aid Guide</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Symptoms to Recognize</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.symptoms.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs rounded-full px-3 py-1">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Emergency Steps</h4>
                    <div className="space-y-3">
                      {selected.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={`h-7 w-7 rounded-full ${selected.gradient} text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                            {i + 1}
                          </div>
                          <p className="text-sm pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="gradient-danger/10 bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Always call 112 for life-threatening emergencies. These guides are for immediate first-aid only.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-20 w-20 rounded-3xl gradient-danger flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold">Select a First-Aid Guide</h3>
                    <p className="text-sm text-muted-foreground mt-1">Choose from the list to view step-by-step emergency instructions.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
