import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Send, Loader2, Heart, Smile, Frown, Meh, Angry, Laugh, Plus, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const moods = [
  { emoji: '😄', label: 'Great', score: 9, color: 'bg-success/10 text-success border-success/20' },
  { emoji: '🙂', label: 'Good', score: 7, color: 'bg-info/10 text-info border-info/20' },
  { emoji: '😐', label: 'Okay', score: 5, color: 'bg-warning/10 text-warning border-warning/20' },
  { emoji: '😔', label: 'Low', score: 3, color: 'bg-accent/10 text-accent border-accent/20' },
  { emoji: '😢', label: 'Sad', score: 1, color: 'bg-destructive/10 text-destructive border-destructive/20' },
];

const cbtExercises = [
  { title: 'Thought Record', desc: 'Identify and challenge negative thoughts', prompt: 'Guide me through a thought record exercise to challenge my negative thinking patterns.' },
  { title: '5-4-3-2-1 Grounding', desc: 'Sensory grounding for anxiety', prompt: 'Guide me through the 5-4-3-2-1 grounding exercise step by step.' },
  { title: 'Box Breathing', desc: '4-second breathing technique', prompt: 'Lead me through a box breathing exercise for relaxation.' },
  { title: 'Gratitude Reflection', desc: 'Focus on positive aspects', prompt: 'Help me do a gratitude reflection exercise.' },
  { title: 'Body Scan', desc: 'Progressive relaxation', prompt: 'Guide me through a body scan meditation for stress relief.' },
  { title: 'Cognitive Reframing', desc: 'See situations differently', prompt: 'Help me practice cognitive reframing on a situation that is bothering me.' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`;

const MentalHealth = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'cbt' | 'mindfulness' | 'journaling'>('chat');
  const [moodNote, setMoodNote] = useState('');
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchMoodLogs();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const fetchMoodLogs = async () => {
    if (!user) return;
    const { data } = await supabase.from('mood_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(14);
    if (data) setMoodLogs(data);
  };

  const logMood = async (mood: typeof moods[0]) => {
    if (!user) return;
    await supabase.from('mood_logs').insert({
      user_id: user.id,
      mood: mood.label,
      mood_score: mood.score,
      notes: moodNote,
    });
    toast.success(`Mood logged: ${mood.emoji} ${mood.label}`);
    setMoodNote('');
    fetchMoodLogs();
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    const userMsg: Msg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], mode: chatMode }),
      });
      if (!resp.ok || !resp.body) throw new Error('Failed to start stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, hsl(330, 70%, 50%), hsl(270, 80%, 55%))' }}>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Brain className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">Mental Health Companion</h1>
            <p className="text-primary-foreground/80 text-sm">Your supportive AI companion for emotional wellbeing</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="chat" className="rounded-lg gap-1.5 text-xs"><Brain className="h-3.5 w-3.5" /> Chat</TabsTrigger>
          <TabsTrigger value="mood" className="rounded-lg gap-1.5 text-xs"><Smile className="h-3.5 w-3.5" /> Mood</TabsTrigger>
          <TabsTrigger value="exercises" className="rounded-lg gap-1.5 text-xs"><Heart className="h-3.5 w-3.5" /> Exercises</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['chat', 'cbt', 'mindfulness', 'journaling'] as const).map(mode => (
              <button key={mode} onClick={() => setChatMode(mode)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium capitalize transition-all ${chatMode === mode ? 'bg-primary text-primary-foreground shadow-colored' : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground'}`}>
                {mode === 'cbt' ? 'CBT' : mode}
              </button>
            ))}
          </div>

          <Card className="overflow-hidden">
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Brain className="h-7 w-7 text-accent" />
                  </div>
                  <p className="font-heading font-semibold">How are you feeling today?</p>
                  <p className="text-sm mt-1">I'm here to listen and support you 💙</p>
                </div>
              )}
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
                    }`}>
                      {m.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input placeholder="Share how you're feeling..." value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                className="rounded-xl" />
              <Button onClick={() => sendMessage()} disabled={isLoading || !input.trim()}
                className="rounded-xl bg-gradient-to-r from-accent to-primary text-primary-foreground px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Mood Tab */}
        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-heading font-semibold">How are you feeling right now?</h3>
              <div className="flex justify-center gap-3">
                {moods.map(m => (
                  <button key={m.label} onClick={() => logMood(m)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-105 hover:shadow-md ${m.color}`}>
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-[10px] font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
              <Textarea placeholder="Optional: What's on your mind?" value={moodNote}
                onChange={e => setMoodNote(e.target.value)} className="rounded-xl" rows={2} />
            </CardContent>
          </Card>

          {moodLogs.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Mood History
                </h3>
                <div className="space-y-2">
                  {moodLogs.map((log: any) => {
                    const moodData = moods.find(m => m.label === log.mood) || moods[2];
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/20">
                        <span className="text-xl">{moodData.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{log.mood}</p>
                          {log.notes && <p className="text-xs text-muted-foreground truncate">{log.notes}</p>}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cbtExercises.map((ex, i) => (
              <Card key={i} className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all" onClick={() => { sendMessage(ex.prompt); }}>
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-heading font-semibold text-sm">{ex.title}</h3>
                  <p className="text-xs text-muted-foreground">{ex.desc}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs mt-2 gap-1.5">
                    <Plus className="h-3 w-3" /> Start Exercise
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealth;
