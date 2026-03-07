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
  { name: 'Emergency (Ambulance)', number: '112', icon: Phone, color: 'bg-destructive text-destructive-foreground' },
  { name: 'Police', number: '100', icon: Shield, color: 'bg-primary text-primary-foreground' },
  { name: 'Fire', number: '101', icon: Flame, color: 'bg-warning text-warning-foreground' },
  { name: 'Poison Control', number: '1800-11-6117', icon: AlertCircle, color: 'bg-chart-4 text-primary-foreground' },
];

const FIRST_AID_GUIDES = [
  {
    title: 'Heart Attack',
    icon: Heart,
    color: 'text-destructive',
    symptoms: ['Chest pain/pressure', 'Shortness of breath', 'Cold sweat', 'Nausea'],
    steps: [
      'Call 112 immediately',
      'Have the person sit or lie down comfortably',
      'Give aspirin (325mg) if not allergic and conscious',
      'Loosen tight clothing',
      'If unconscious and not breathing, begin CPR',
      'Use AED if available',
    ],
  },
  {
    title: 'Choking',
    icon: Droplets,
    color: 'text-primary',
    symptoms: ['Cannot speak/cough/breathe', 'Clutching throat', 'Turning blue'],
    steps: [
      'Ask "Are you choking?" – if they can\'t respond, act immediately',
      'Stand behind the person, wrap arms around waist',
      'Make a fist above the navel, below ribcage',
      'Give 5 quick upward abdominal thrusts (Heimlich maneuver)',
      'Repeat until object is expelled',
      'If unconscious, call 112 and begin CPR',
    ],
  },
  {
    title: 'Burns',
    icon: Flame,
    color: 'text-warning',
    symptoms: ['Red/blistered skin', 'Pain', 'Swelling', 'White/charred skin (severe)'],
    steps: [
      'Remove from heat source immediately',
      'Cool burn under running water for 10-20 minutes',
      'Do NOT apply ice, butter, or toothpaste',
      'Cover loosely with sterile bandage',
      'Take over-the-counter pain relief if needed',
      'Seek medical help for burns larger than your palm or on face/joints',
    ],
  },
  {
    title: 'Electric Shock',
    icon: Zap,
    color: 'text-warning',
    symptoms: ['Burns at contact point', 'Muscle spasms', 'Difficulty breathing', 'Loss of consciousness'],
    steps: [
      'Do NOT touch the person if still in contact with electrical source',
      'Turn off power source or use non-conducting object to separate',
      'Call 112 immediately',
      'Check breathing and pulse – begin CPR if needed',
      'Treat visible burns with cool water',
      'Keep person lying down and warm (treat for shock)',
    ],
  },
  {
    title: 'Snake/Insect Bite',
    icon: Bug,
    color: 'text-success',
    symptoms: ['Puncture marks', 'Swelling/redness', 'Pain', 'Nausea/dizziness'],
    steps: [
      'Keep the person calm and still',
      'Call 112 or go to nearest hospital',
      'Remove jewelry/tight clothing near bite',
      'Keep bitten area below heart level',
      'Do NOT cut the wound or try to suck out venom',
      'Note the time of bite and appearance of snake/insect if possible',
    ],
  },
  {
    title: 'Fractures',
    icon: Bone,
    color: 'text-primary',
    symptoms: ['Severe pain', 'Swelling', 'Deformity', 'Inability to move limb'],
    steps: [
      'Do NOT try to realign the bone',
      'Immobilize the injured area – use a splint if available',
      'Apply ice pack wrapped in cloth to reduce swelling',
      'Elevate the injured limb if possible',
      'Give pain medication if conscious',
      'Seek immediate medical attention',
    ],
  },
  {
    title: 'Seizure',
    icon: Brain,
    color: 'text-chart-4',
    symptoms: ['Uncontrolled shaking', 'Loss of consciousness', 'Stiffening', 'Confusion after'],
    steps: [
      'Clear the area of dangerous objects',
      'Do NOT hold the person down or put anything in their mouth',
      'Place them on their side (recovery position)',
      'Cushion the head with something soft',
      'Time the seizure – call 112 if it lasts > 5 minutes',
      'Stay with them until fully conscious and oriented',
    ],
  },
  {
    title: 'Infant Choking',
    icon: Baby,
    color: 'text-warning',
    symptoms: ['Difficulty breathing', 'Weak/no cry', 'Turning blue', 'Cannot cough'],
    steps: [
      'Place infant face-down on your forearm, supporting the head',
      'Give 5 firm back blows between shoulder blades',
      'Turn infant face-up and give 5 chest thrusts (2 fingers on breastbone)',
      'Repeat back blows and chest thrusts until object is expelled',
      'If infant becomes unconscious, call 112 and begin infant CPR',
      'Do NOT use abdominal thrusts on infants under 1 year',
    ],
  },
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
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-destructive to-red-700 p-6 text-destructive-foreground">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6" />
            <h1 className="text-2xl font-heading font-bold">Emergency Services</h1>
          </div>
          <p className="text-destructive-foreground/80 text-sm">Quick access to emergency contacts and first-aid guides</p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      </div>

      {/* Emergency Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {EMERGENCY_NUMBERS.map((num) => (
          <a key={num.number} href={`tel:${num.number}`}>
            <Card className="rounded-card shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center space-y-2">
                <div className={`h-12 w-12 rounded-xl ${num.color} flex items-center justify-center mx-auto`}>
                  <num.icon className="h-6 w-6" />
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
            <Input
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Guide List */}
          <Card className="rounded-card shadow-sm lg:col-span-1">
            <ScrollArea className="h-[500px]">
              <CardContent className="p-2 space-y-1">
                {filtered.map((guide) => (
                  <button
                    key={guide.title}
                    onClick={() => setSelected(guide)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      selected?.title === guide.title ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <guide.icon className={`h-5 w-5 ${guide.color} shrink-0`} />
                    <span className="text-sm font-medium flex-1">{guide.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Guide Detail */}
          <Card className="rounded-card shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              {selected ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center`}>
                      <selected.icon className={`h-6 w-6 ${selected.color}`} />
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
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Emergency Steps</h4>
                    <div className="space-y-3">
                      {selected.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Always call 112 for life-threatening emergencies. These guides are for immediate first-aid only.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
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
