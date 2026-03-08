import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setNotifications(data as Notification[]);
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === (payload.new as Notification).id ? payload.new as Notification : n));
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold shadow-sm"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-border/50" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h3 className="font-heading font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2 gap-1" onClick={markAllRead}>
              <CheckCheck className="h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              <AnimatePresence initial={false}>
                {notifications.map((n) => {
                  const cfg = typeConfig[n.type] || typeConfig.info;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex gap-3 px-4 py-3 transition-colors ${!n.is_read ? 'bg-accent/30' : 'hover:bg-accent/10'}`}
                    >
                      <div className={`shrink-0 mt-0.5 h-7 w-7 rounded-full ${cfg.bg} flex items-center justify-center`}>
                        <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-tight ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        {!n.is_read && (
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markAsRead(n.id)}>
                            <Check className="h-3 w-3 text-primary" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteNotification(n.id)}>
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
