import { Globe, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationDropdown from '@/components/NotificationDropdown';

interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  const { profile, signOut } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  const currentLang = languages.find(l => l.code === language);

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-14 border-b border-border/50 bg-card/60 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 sticky top-0 z-30 relative overflow-hidden">
      {/* Subtle gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-violet-500 transition-colors" />
        <div className="flex items-center gap-2">
          <h1 className="font-heading font-semibold text-lg text-foreground">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-9">
              <Globe className="h-3.5 w-3.5" />
              <span>{currentLang?.flag}</span>
              <span className="hidden sm:inline">{currentLang?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
            <ScrollArea className="max-h-64">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center justify-between gap-2 cursor-pointer rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-sm">{lang.label}</span>
                  </span>
                  {language === lang.code && <Check className="h-3.5 w-3.5 text-violet-500" />}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-muted/50">
              <Avatar className="h-8 w-8 ring-2 ring-violet-500/20 ring-offset-1 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
            <DropdownMenuItem className="text-xs text-muted-foreground">{profile?.email}</DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="text-rose-500 focus:text-rose-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
