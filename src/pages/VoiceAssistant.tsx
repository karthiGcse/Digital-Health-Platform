import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Send, Globe, Loader2, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
];

const quickPhrases: Record<string, string[]> = {
  en: ['What medicines should I take for fever?', 'Remind me about my medication', 'Find a nearby pharmacy', 'I need emergency help'],
  hi: ['बुखार के लिए मुझे कौन सी दवा लेनी चाहिए?', 'मुझे दवा की याद दिलाओ', 'पास की फार्मेसी खोजो', 'मुझे आपातकालीन मदद चाहिए'],
  ta: ['காய்ச்சலுக்கு எந்த மருந்து எடுக்க வேண்டும்?', 'மருந்து நினைவூட்டல்', 'அருகிலுள்ள மருந்தகம்', 'அவசர உதவி தேவை'],
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const VoiceAssistant = () => {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const getLangCode = useCallback((lang: string) => {
    const map: Record<string, string> = {
      en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN',
      mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
      ur: 'ur-PK', es: 'es-ES', fr: 'fr-FR', ar: 'ar-SA',
    };
    return map[lang] || 'en-US';
  }, []);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*_`~>\-|]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = getLangCode(language);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [language, getLangCode]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    stopSpeaking();
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message: msg, language },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      const assistantMsg: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMsg]);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      if (autoRead && data.response) {
        speakText(data.response);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Speech recognition not supported in this browser'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => { setIsListening(false); toast.error('Could not recognize speech'); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };


  const phrases = quickPhrases[language] || quickPhrases.en;

  return (
    <div className="space-y-6">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, hsl(240, 60%, 50%), hsl(200, 80%, 50%))' }}>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Globe className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">Voice Assistant</h1>
            <p className="text-primary-foreground/80 text-sm">Multilingual health assistant — speak in your language</p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map(l => (
              <SelectItem key={l.code} value={l.code}>
                <span className="flex items-center gap-2">{l.flag} {l.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="self-start gap-1.5 px-3 py-1.5">
          <Globe className="h-3 w-3" /> {languages.find(l => l.code === language)?.name}
        </Badge>
        <div className="flex items-center gap-2 ml-auto">
          {isSpeaking && (
            <Button variant="outline" size="sm" onClick={stopSpeaking} className="gap-1.5 text-xs">
              <VolumeX className="h-3.5 w-3.5" /> Stop
            </Button>
          )}
          <Button
            variant={autoRead ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRead(!autoRead)}
            className={`gap-1.5 text-xs rounded-full px-4 ${autoRead ? 'bg-primary text-primary-foreground shadow-sm' : ''}`}
          >
            {autoRead ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            Auto-Read {autoRead ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Quick Phrases */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {phrases.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p)}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-medium bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <Card className="overflow-hidden">
        <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-info/10 flex items-center justify-center mb-3">
                <MessageSquare className="h-7 w-7 text-info" />
              </div>
              <p className="font-heading font-semibold">Ask me anything about health</p>
              <p className="text-sm mt-1">Type, speak, or tap a quick phrase above</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
                }`}>
                  {m.role === 'assistant' ? (
                    <div className="flex gap-2">
                      <div className="prose prose-sm dark:prose-invert max-w-none flex-1">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      <button onClick={() => speakText(m.content)} className="shrink-0 p-1 rounded hover:bg-muted/80 self-start mt-0.5">
                        <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                      </button>
                    </div>
                  ) : m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-3 flex gap-2">
          <Button variant={isListening ? 'destructive' : 'outline'} size="icon" className="shrink-0 rounded-xl"
            onClick={toggleListening}>
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input placeholder="Type your message..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="rounded-xl" />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-info to-primary text-primary-foreground px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
