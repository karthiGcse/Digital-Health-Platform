import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK_QUESTIONS = [
  "What are common causes of headaches?",
  "How to improve sleep quality?",
  "Signs of dehydration to watch for",
  "When should I see a doctor for a cough?",
  "Tips for managing stress and anxiety",
  "How to read blood pressure numbers",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultation`;

const AIConsultation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);
    let assistantSoFar = '';
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: allMessages }),
      });
      if (!resp.ok) { const errData = await resp.json().catch(() => ({})); throw new Error(errData.error || `Error ${resp.status}`); }
      if (!resp.body) throw new Error('No response stream');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { textBuffer = line + '\n' + textBuffer; break; }
        }
      }
      if (user && assistantSoFar) {
        const sessionId = crypto.randomUUID();
        await supabase.from('consultation_messages').insert([
          { user_id: user.id, session_id: sessionId, role: 'user', content: text.trim() },
          { user_id: user.id, session_id: sessionId, role: 'assistant', content: assistantSoFar },
        ]);
      }
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message, variant: 'destructive' });
      setMessages(prev => prev.filter(m => m !== userMsg));
    } finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="stat-icon-purple">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">AI Health Consultation</h1>
            <p className="text-xs text-muted-foreground">Powered by S47 Health AI • Not a substitute for professional advice</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="h-4 w-4 mr-1" /> New Chat
          </Button>
        )}
      </div>

      <Card className="flex-1 rounded-2xl shadow-sm overflow-hidden flex flex-col border-0 shadow-colored">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-6">
              <div className="h-20 w-20 rounded-3xl gradient-health flex items-center justify-center shadow-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold">How can I help you today?</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Ask me about symptoms, medications, health tips, or general wellness questions.</p>
              </div>
              <div className="flex flex-wrap gap-2 max-w-lg justify-center">
                {QUICK_QUESTIONS.map((q) => (
                  <Badge key={q} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all px-3 py-2 text-xs rounded-full shadow-sm" onClick={() => sendMessage(q)}>
                    {q}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-xl gradient-health flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'gradient-health text-white rounded-br-md shadow-glow'
                      : 'bg-muted rounded-bl-md'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                    ) : msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="h-8 w-8 rounded-xl gradient-cool flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl gradient-health flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a health question..." disabled={isLoading} className="flex-1 rounded-xl" />
            <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="rounded-xl gradient-health border-0 shadow-glow hover:opacity-90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIConsultation;
